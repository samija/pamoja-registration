/** WhatsApp notifications via Twilio */

const TWILIO_BASE = "https://api.twilio.com/2010-04-01";

function getCredentials() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. "whatsapp:+14155238886"
  if (!sid || !token || !from) throw new Error("Twilio credentials not set");
  return { sid, token, from };
}

export async function sendWhatsApp(to: string, message: string): Promise<boolean> {
  try {
    const { sid, token, from } = getCredentials();

    // Ensure whatsapp: prefix
    const toFormatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;

    const res = await fetch(`${TWILIO_BASE}/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: from,
        To: toFormatted,
        Body: message,
      }),
    });

    const data = await res.json();
    return data.sid != null;
  } catch (error) {
    console.error("[WHATSAPP] Failed:", error);
    return false;
  }
}

export function buildConfirmationMessage(data: {
  firstName: string;
  conferenceName: string;
  amount: string;
  currency: string;
  txRef: string;
}): string {
  return [
    `✅ *Registration Confirmed*`,
    ``,
    `Hello ${data.firstName},`,
    `Your registration for *${data.conferenceName}* is confirmed!`,
    ``,
    `💰 Amount: ${data.amount} ${data.currency}`,
    `📋 Ref: ${data.txRef}`,
    ``,
    `We look forward to seeing you in Addis Ababa!`,
    `— Pamoja Africa V`,
  ].join("\n");
}
