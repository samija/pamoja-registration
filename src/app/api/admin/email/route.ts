import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/notifications/email";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subject, body, filter } = await req.json();

    if (!subject || !body) {
      return NextResponse.json({ error: "Subject and body required" }, { status: 400 });
    }

    // Build query based on filter
    let query = supabase.from("registrants").select("email, first_name");

    if (filter?.status) query = query.eq("status", filter.status);
    if (filter?.countrySlug) {
      const { data: country } = await supabase.from("countries").select("id").eq("slug", filter.countrySlug).single();
      if (country) query = query.eq("country_id", country.id);
    }

    const { data: registrants } = await query;
    if (!registrants || registrants.length === 0) {
      return NextResponse.json({ error: "No recipients match the filter" }, { status: 404 });
    }

    // Send emails (in production, use a queue/batch service)
    let sent = 0;
    for (const r of registrants) {
      const personalizedBody = body
        .replace(/\{\{name\}\}/g, r.first_name)
        .replace(/\{\{email\}\}/g, r.email);

      const success = await sendEmail({
        to: r.email,
        subject,
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: #0A1002; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px;">
              <h1 style="color: #8DCF3D; font-size: 20px; margin: 0;">PAMOJA</h1>
            </div>
            <div style="color: #2C2C2C; line-height: 1.7; font-size: 15px;">
              ${personalizedBody}
            </div>
            <hr style="border: none; border-top: 1px solid #E5E2DC; margin: 30px 0;">
            <p style="color: #9B9B8F; font-size: 12px; text-align: center;">
              Pamoja Africa V &middot; runpamoja.org
            </p>
          </div>
        `,
      });

      if (success) sent++;
    }

    return NextResponse.json({ success: true, sent, total: registrants.length });
  } catch (error) {
    console.error("Email blast error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
