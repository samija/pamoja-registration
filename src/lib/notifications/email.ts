/** Email notification service
 *
 * In production, wire this to Resend, SendGrid, or Supabase Edge Functions.
 * For MVP, this logs the email and provides the interface for future integration.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  // TODO: Replace with actual email provider (Resend recommended)
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({ from: 'noreply@runpamoja.org', ...payload });

  console.log("[EMAIL]", payload.to, payload.subject);
  return true;
}

export function buildConfirmationEmail(data: {
  firstName: string;
  lastName: string;
  conferenceName: string;
  txRef: string;
  amount: string;
  currency: string;
}): EmailPayload {
  return {
    to: "", // caller sets this
    subject: `Registration Confirmed — ${data.conferenceName}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: #0A1002; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
          <h1 style="color: #8DCF3D; font-size: 24px; margin: 0;">PAMOJA</h1>
          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 8px 0 0;">Africa V</p>
        </div>

        <h2 style="color: #2C2C2C; font-size: 20px;">You're Confirmed!</h2>
        <p style="color: #4A4A4A; line-height: 1.6;">
          Dear ${data.firstName} ${data.lastName},<br><br>
          Your registration for <strong>${data.conferenceName}</strong> has been confirmed.
        </p>

        <div style="background: #FAF7F2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #4A4A4A; font-size: 14px;">
            <strong>Amount Paid:</strong> ${data.amount} ${data.currency}<br>
            <strong>Reference:</strong> ${data.txRef}
          </p>
        </div>

        <p style="color: #4A4A4A; line-height: 1.6;">
          We look forward to seeing you in Addis Ababa!
        </p>

        <hr style="border: none; border-top: 1px solid #E5E2DC; margin: 30px 0;">
        <p style="color: #9B9B8F; font-size: 12px; text-align: center;">
          Pamoja Africa V &middot; Addis Ababa, Ethiopia &middot; July 2028
        </p>
      </div>
    `,
  };
}
