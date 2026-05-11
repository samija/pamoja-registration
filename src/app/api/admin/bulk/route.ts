import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No registrants selected" }, { status: 400 });
    }

    if (action === "confirm") {
      const { error } = await supabase
        .from("registrants")
        .update({ status: "confirmed" })
        .in("id", ids);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, updated: ids.length });
    }

    if (action === "cancel") {
      const { error } = await supabase
        .from("registrants")
        .update({ status: "cancelled" })
        .in("id", ids);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, updated: ids.length });
    }

    if (action === "export") {
      const { data: registrants, error } = await supabase
        .from("registrants")
        .select("*, countries(name, currency), conferences(name), payments(amount_local, currency_local, amount_usd, status)")
        .in("id", ids);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      const headers = ["First Name","Last Name","Email","Phone","Organization","Country","Conference","Status"];
      const rows = (registrants || []).map((r) => {
        const country = Array.isArray(r.countries) ? r.countries[0] : r.countries;
        const conf = Array.isArray(r.conferences) ? r.conferences[0] : r.conferences;
        return [r.first_name, r.last_name, r.email, r.phone || "", r.organization || "", country?.name || "", conf?.name || "", r.status]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
      });

      const csv = [headers.join(","), ...rows].join("\n");
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="pamoja-selected-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Bulk action error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
