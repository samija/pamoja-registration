import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGateway } from "@/lib/payments/router";
import { getCountryConfig } from "@/config/countries";
import { getPricingForCountry } from "@/config/conferences";
import { getExchangeRate, convertToUsd } from "@/lib/exchange/rates";
import { generateQRCode } from "@/lib/qr/generate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countrySlug, conferenceId, groupName, leaderName, leaderEmail, leaderPhone, organization, members } = body;

    const countryConfig = getCountryConfig(countrySlug);
    if (!countryConfig) return NextResponse.json({ error: "Invalid country" }, { status: 400 });

    const pricing = getPricingForCountry(countrySlug);
    const selectedPricing = pricing.find((p) => p.conferenceId === conferenceId);
    if (!selectedPricing) return NextResponse.json({ error: "Invalid conference" }, { status: 400 });

    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: "At least one member required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data: country } = await supabase.from("countries").select("id").eq("slug", countrySlug).single();
    const { data: conference } = await supabase.from("conferences").select("id").eq("slug", conferenceId).single();
    if (!country || !conference) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Create group
    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        country_id: country.id,
        name: groupName,
        leader_name: leaderName,
        leader_email: leaderEmail,
        leader_phone: leaderPhone,
        organization,
        size: members.length,
      })
      .select("id")
      .single();

    if (groupError || !group) {
      return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
    }

    // Register all members
    const registrantIds: string[] = [];
    for (const member of members) {
      const qrCode = await generateQRCode(`${group.id}-${member.email}`);
      const { data: reg, error: regError } = await supabase
        .from("registrants")
        .insert({
          country_id: country.id,
          conference_id: conference.id,
          group_id: group.id,
          first_name: member.firstName,
          last_name: member.lastName,
          email: member.email,
          phone: member.phone,
          gender: member.gender,
          role: member.role,
          organization,
          status: "pending",
          locale: countryConfig.locale,
          qr_code: qrCode,
        })
        .select("id")
        .single();

      if (regError || !reg) {
        console.error("Member registration error:", regError);
        continue;
      }
      registrantIds.push(reg.id);
    }

    if (registrantIds.length === 0) {
      return NextResponse.json({ error: "Failed to register any members" }, { status: 500 });
    }

    // Calculate total payment
    const totalAmount = selectedPricing.priceLocal * registrantIds.length;
    const exchangeRate = await getExchangeRate(selectedPricing.currency);
    const amountUsd = convertToUsd(totalAmount, exchangeRate);
    const txRef = `pamoja-grp-${countrySlug}-${group.id.slice(0, 8)}-${Date.now()}`;

    // Create one payment for the group (linked to first registrant as primary)
    await supabase.from("payments").insert({
      registrant_id: registrantIds[0],
      gateway: countryConfig.paymentGateway,
      gateway_tx_ref: txRef,
      amount_local: totalAmount,
      currency_local: selectedPricing.currency,
      exchange_rate: exchangeRate,
      amount_usd: amountUsd,
      status: "initiated",
    });

    // Initiate payment
    const gateway = getGateway(countryConfig.paymentGateway);
    const origin = req.nextUrl.origin;
    const paymentResult = await gateway.initiate({
      amount: totalAmount,
      currency: selectedPricing.currency,
      txRef,
      email: leaderEmail,
      firstName: leaderName.split(" ")[0] || leaderName,
      lastName: leaderName.split(" ").slice(1).join(" ") || "",
      phone: leaderPhone,
      callbackUrl: `${origin}/api/payments/webhook`,
      returnUrl: `${origin}/${countrySlug}/register/success?tx_ref=${txRef}`,
      description: `Pamoja Africa V — Group: ${groupName} (${registrantIds.length} members)`,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: paymentResult.checkoutUrl,
      txRef,
      membersRegistered: registrantIds.length,
    });
  } catch (error) {
    console.error("Group registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
