import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { chapaGateway } from "@/lib/payments/chapa";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const txRef = body.tx_ref || body.trx_ref;

    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    // Verify with Chapa
    const verification = await chapaGateway.verify(txRef);

    const supabase = await createServerSupabaseClient();

    if (verification.success && verification.status === "completed") {
      // Update payment
      await supabase
        .from("payments")
        .update({
          status: "completed",
          gateway_response: verification.gatewayResponse,
          paid_at: new Date().toISOString(),
        })
        .eq("gateway_tx_ref", txRef);

      // Update registrant status
      const { data: payment } = await supabase
        .from("payments")
        .select("registrant_id")
        .eq("gateway_tx_ref", txRef)
        .single();

      if (payment) {
        await supabase
          .from("registrants")
          .update({ status: "confirmed" })
          .eq("id", payment.registrant_id);
      }

      // TODO: Send confirmation email/WhatsApp

      return NextResponse.json({ success: true });
    }

    // Payment failed or pending
    const status = verification.status === "pending" ? "pending" : "failed";
    await supabase
      .from("payments")
      .update({
        status,
        gateway_response: verification.gatewayResponse,
      })
      .eq("gateway_tx_ref", txRef);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
