import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabaseClient();

  const { data: reg } = await supabase
    .from("registrants")
    .select("first_name, last_name, email, conferences(name, start_date, end_date, location)")
    .eq("id", id)
    .eq("status", "confirmed")
    .single();

  if (!reg) return NextResponse.json({ error: "Confirmed registration not found" }, { status: 404 });

  const conference = Array.isArray(reg.conferences) ? reg.conferences[0] : reg.conferences;
  if (!conference) return NextResponse.json({ error: "Conference not found" }, { status: 404 });

  // Format dates for iCal (YYYYMMDD)
  const startDate = conference.start_date.replace(/-/g, "");
  const endDate = conference.end_date.replace(/-/g, "");
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Pamoja Africa V//Registration System//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART;VALUE=DATE:${startDate}`,
    `DTEND;VALUE=DATE:${endDate}`,
    `DTSTAMP:${now}`,
    `UID:pamoja-${id}@runpamoja.org`,
    `SUMMARY:${conference.name}`,
    `DESCRIPTION:You are registered for ${conference.name} as ${reg.first_name} ${reg.last_name}. Visit runpamoja.org/status to check your registration.`,
    `LOCATION:${conference.location || "Addis Ababa Convention Center, Addis Ababa, Ethiopia"}`,
    "STATUS:CONFIRMED",
    `ORGANIZER;CN=Pamoja Africa V:mailto:info@runpamoja.org`,
    `ATTENDEE;CN=${reg.first_name} ${reg.last_name}:mailto:${reg.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="pamoja-${conference.name.toLowerCase().replace(/\s+/g, "-")}.ics"`,
    },
  });
}
