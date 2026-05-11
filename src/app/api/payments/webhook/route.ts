import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getGateway } from "@/lib/payments/router";
import { sendEmail, buildConfirmationEmail } from "@/lib/notifications/email";
import { sendWhatsApp, buildConfirmationMessage } from "@/lib/notifications/whatsapp";
import { notifyAdminChannel } from "@/lib/notifications/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const txRef = body.tx_ref || body.trx_ref || body.reference;

    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Find the payment to determine which gateway to verify with
    const { data: paymentRecord } = await supabase
      .from("payments")
      .select("registrant_id, gateway")
      .eq("gateway_tx_ref", txRef)
      .single();

    if (!paymentRecord) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Verify with the correct gateway
    const gateway = getGateway(paymentRecord.gateway);
    const verification = await gateway.verify(txRef);

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
      await supabase
        .from("registrants")
        .update({ status: "confirmed" })
        .eq("id", paymentRecord.registrant_id);

      // Fetch registrant details for notifications
      const { data: registrant } = await supabase
        .from("registrants")
        .select("first_name, last_name, email, phone, countries(name, currency_symbol, currency), conferences(name)")
        .eq("id", paymentRecord.registrant_id)
        .single();

      if (registrant) {
        const country = Array.isArray(registrant.countries) ? registrant.countries[0] : registrant.countries;
        const conference = Array.isArray(registrant.conferences) ? registrant.conferences[0] : registrant.conferences;

        // Send confirmation email
        const emailPayload = buildConfirmationEmail({
          firstName: registrant.first_name,
          lastName: registrant.last_name,
          conferenceName: conference?.name || "Pamoja Africa V",
          txRef,
          amount: `${country?.currency_symbol || ""}${verification.amount.toLocaleString()}`,
          currency: country?.currency || "",
        });
        emailPayload.to = registrant.email;
        await sendEmail(emailPayload).catch((e) => console.error("[WEBHOOK] Email failed:", e));

        // Send WhatsApp confirmation
        if (registrant.phone) {
          const whatsappMsg = buildConfirmationMessage({
            firstName: registrant.first_name,
            conferenceName: conference?.name || "Pamoja Africa V",
            amount: `${country?.currency_symbol || ""}${verification.amount.toLocaleString()}`,
            currency: country?.currency || "",
            txRef,
          });
          await sendWhatsApp(registrant.phone, whatsappMsg).catch((e) => console.error("[WEBHOOK] WhatsApp failed:", e));
        }

        // Notify admin Telegram channel
        await notifyAdminChannel({
          firstName: registrant.first_name,
          lastName: registrant.last_name,
          country: country?.name || "Unknown",
          conference: conference?.name || "Unknown",
          amount: `${country?.currency_symbol || ""}${verification.amount.toLocaleString()}`,
          currency: country?.currency || "",
          status: "confirmed",
        }).catch((e) => console.error("[WEBHOOK] Telegram failed:", e));
      }

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
