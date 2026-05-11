import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGateway } from "@/lib/payments/router";
import { getCountryConfig } from "@/config/countries";
import { getPricingForCountry } from "@/config/conferences";
import { getExchangeRate, convertToUsd } from "@/lib/exchange/rates";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 registrations per minute per IP
    const ip = getClientIp(req.headers);
    const { allowed } = rateLimit(`register:${ip}`, 5);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const {
      countrySlug,
      conferenceId,
      firstName,
      lastName,
      email,
      phone,
      gender,
      organization,
      role,
      city,
    } = body;

    // Validate country
    const countryConfig = getCountryConfig(countrySlug);
    if (!countryConfig) {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    // Validate conference pricing
    const pricing = getPricingForCountry(countrySlug);
    const selectedPricing = pricing.find((p) => p.conferenceId === conferenceId);
    if (!selectedPricing) {
      return NextResponse.json({ error: "Invalid conference" }, { status: 400 });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Check for duplicate email in same conference
    const { data: existing } = await supabase
      .from("registrants")
      .select("id")
      .eq("email", email)
      .eq("status", "confirmed")
      .limit(1);

    if (existing && existing.length > 0) {
      return NextResponse.json({ error: "This email is already registered. Check your inbox for confirmation." }, { status: 409 });
    }

    // Get country and conference IDs from DB
    const { data: country } = await supabase
      .from("countries")
      .select("id")
      .eq("slug", countrySlug)
      .single();

    const { data: conference } = await supabase
      .from("conferences")
      .select("id")
      .eq("slug", conferenceId)
      .single();

    if (!country || !conference) {
      return NextResponse.json({ error: "Country or conference not found" }, { status: 404 });
    }

    // Create registrant
    const { data: registrant, error: regError } = await supabase
      .from("registrants")
      .insert({
        country_id: country.id,
        conference_id: conference.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        gender,
        organization,
        role,
        city,
        status: "pending",
        locale: countryConfig.locale,
      })
      .select("id")
      .single();

    if (regError || !registrant) {
      console.error("Registration error:", regError);
      return NextResponse.json({ error: "Failed to create registration" }, { status: 500 });
    }

    // Get exchange rate
    const exchangeRate = await getExchangeRate(selectedPricing.currency);
    const amountUsd = convertToUsd(selectedPricing.priceLocal, exchangeRate);

    // Generate transaction reference
    const txRef = `pamoja-${countrySlug}-${registrant.id.slice(0, 8)}-${Date.now()}`;

    // Create payment record
    const { error: payError } = await supabase.from("payments").insert({
      registrant_id: registrant.id,
      gateway: countryConfig.paymentGateway,
      gateway_tx_ref: txRef,
      amount_local: selectedPricing.priceLocal,
      currency_local: selectedPricing.currency,
      exchange_rate: exchangeRate,
      amount_usd: amountUsd,
      status: "initiated",
    });

    if (payError) {
      console.error("Payment record error:", payError);
      return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
    }

    // Initiate payment via country-specific gateway
    const gateway = getGateway(countryConfig.paymentGateway);
    const origin = req.nextUrl.origin;
    const paymentResult = await gateway.initiate({
      amount: selectedPricing.priceLocal,
      currency: selectedPricing.currency,
      txRef,
      email,
      firstName,
      lastName,
      phone,
      callbackUrl: `${origin}/api/payments/webhook`,
      returnUrl: `${origin}/${countrySlug}/register/success?tx_ref=${txRef}`,
      description: `Pamoja Africa V — ${conferenceId}`,
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error || "Payment initiation failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymentResult.checkoutUrl,
      txRef,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
