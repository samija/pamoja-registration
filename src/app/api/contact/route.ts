import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/notifications/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const { allowed } = rateLimit(`contact:${ip}`, 3, 300000); // 3 per 5 minutes
    if (!allowed) {
      return NextResponse.json({ error: "Too many messages. Please wait." }, { status: 429 });
    }

    const { name, email, category, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Send to admin
    await sendEmail({
      to: "info@runpamoja.org",
      subject: `[Pamoja Contact] ${category || "General"} — from ${name}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Category:</strong> ${category || "—"}</p>
          <hr>
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
