import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { countrySlug, conferenceId, registrants } = await req.json();

    if (!registrants || !Array.isArray(registrants) || registrants.length === 0) {
      return NextResponse.json({ error: "No registrants provided" }, { status: 400 });
    }

    // Get country and conference IDs
    const { data: country } = await supabase.from("countries").select("id, locale").eq("slug", countrySlug).single();
    const { data: conference } = await supabase.from("conferences").select("id").eq("slug", conferenceId).single();

    if (!country || !conference) {
      return NextResponse.json({ error: "Invalid country or conference" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;

    for (const r of registrants) {
      // Check for duplicate
      const { data: existing } = await supabase
        .from("registrants")
        .select("id")
        .eq("email", r.email)
        .eq("conference_id", conference.id)
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      const { error } = await supabase.from("registrants").insert({
        country_id: country.id,
        conference_id: conference.id,
        first_name: r.firstName,
        last_name: r.lastName,
        email: r.email,
        phone: r.phone || null,
        gender: r.gender || null,
        organization: r.organization || null,
        role: r.role || null,
        city: r.city || null,
        status: "confirmed", // Imported = already confirmed
        locale: country.locale,
      });

      if (!error) imported++;
      else skipped++;
    }

    // Audit log
    await logAction(supabase, "import", "registrant", undefined, {
      countrySlug,
      conferenceId,
      imported,
      skipped,
      total: registrants.length,
    });

    return NextResponse.json({ success: true, imported, skipped });
  } catch (error) {
    console.error("Import error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
