import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const txRef = req.nextUrl.searchParams.get("tx_ref");

  if (!email && !txRef) {
    return NextResponse.json({ error: "Provide email or tx_ref" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("registrants")
    .select("id, first_name, last_name, email, status, checked_in, created_at, conferences(name), countries(name, currency_symbol), payments(gateway_tx_ref, amount_local, currency_local, status, paid_at)");

  if (txRef) {
    // Find registrant by payment tx_ref
    const { data: payment } = await supabase
      .from("payments")
      .select("registrant_id")
      .eq("gateway_tx_ref", txRef)
      .single();

    if (!payment) return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    query = query.eq("id", payment.registrant_id);
  } else {
    query = query.eq("email", email!);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }

  // Strip sensitive fields, return safe data
  const results = data.map((r) => ({
    id: r.id,
    name: `${r.first_name} ${r.last_name}`,
    email: r.email,
    status: r.status,
    checkedIn: r.checked_in,
    registeredAt: r.created_at,
    conference: r.conferences,
    country: r.countries,
    payments: r.payments?.map((p: { gateway_tx_ref: string; amount_local: number; currency_local: string; status: string; paid_at: string | null }) => ({
      txRef: p.gateway_tx_ref,
      amount: p.amount_local,
      currency: p.currency_local,
      status: p.status,
      paidAt: p.paid_at,
    })),
  }));

  return NextResponse.json({ results });
}
