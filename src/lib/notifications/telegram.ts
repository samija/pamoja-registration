/** Telegram Bot notifications */

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return token;
}

export async function sendTelegram(chatId: string, message: string): Promise<boolean> {
  try {
    const token = getBotToken();
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const data = await res.json();
    return data.ok === true;
  } catch (error) {
    console.error("[TELEGRAM] Failed:", error);
    return false;
  }
}

/** Send notification to admin channel about new registration */
export async function notifyAdminChannel(data: {
  firstName: string;
  lastName: string;
  country: string;
  conference: string;
  amount: string;
  currency: string;
  status: string;
}): Promise<boolean> {
  const channelId = process.env.TELEGRAM_ADMIN_CHANNEL_ID;
  if (!channelId) return false;

  const message = [
    `🆕 *New Registration*`,
    ``,
    `👤 ${data.firstName} ${data.lastName}`,
    `🌍 ${data.country}`,
    `📋 ${data.conference}`,
    `💰 ${data.amount} ${data.currency}`,
    `📊 Status: ${data.status}`,
  ].join("\n");

  return sendTelegram(channelId, message);
}
