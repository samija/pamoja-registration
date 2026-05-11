import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { registrantId, method = "qr", notes } = await req.json();
    if (!registrantId) return NextResponse.json({ error: "registrantId required" }, { status: 400 });

    // Check if already checked in
    const { data: existing } = await supabase
      .from("checkins")
      .select("id")
      .eq("registrant_id", registrantId)
      .single();

    if (existing) {
      return NextResponse.json({ error: "Already checked in", alreadyCheckedIn: true }, { status: 409 });
    }

    // Verify registrant is confirmed
    const { data: registrant } = await supabase
      .from("registrants")
      .select("id, first_name, last_name, status, conference_id, conferences(name)")
      .eq("id", registrantId)
      .single();

    if (!registrant) return NextResponse.json({ error: "Registrant not found" }, { status: 404 });
    if (registrant.status !== "confirmed") {
      return NextResponse.json({ error: `Cannot check in — status is "${registrant.status}"` }, { status: 400 });
    }

    // Create check-in
    await supabase.from("checkins").insert({
      registrant_id: registrantId,
      checked_in_by: user.id,
      method,
      notes,
    });

    // Update registrant
    await supabase.from("registrants").update({ checked_in: true }).eq("id", registrantId);

    return NextResponse.json({
      success: true,
      registrant: {
        id: registrant.id,
        name: `${registrant.first_name} ${registrant.last_name}`,
        conference: registrant.conferences,
      },
    });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
