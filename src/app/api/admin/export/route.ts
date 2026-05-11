import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createServerSupabaseClient();

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: registrants, error } = await supabase
    .from("registrants")
    .select("*, countries(name, currency), conferences(name), payments(amount_local, currency_local, amount_usd, status)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build CSV
  const headers = [
    "First Name", "Last Name", "Email", "Phone", "Gender",
    "Organization", "Role", "City", "Country", "Conference",
    "Status", "Payment Status", "Amount Local", "Currency", "Amount USD",
    "Registered At",
  ];

  const rows = (registrants || []).map((r) => {
    const payment = r.payments?.[0];
    return [
      r.first_name,
      r.last_name,
      r.email,
      r.phone || "",
      r.gender || "",
      r.organization || "",
      r.role || "",
      r.city || "",
      r.countries?.name || "",
      r.conferences?.name || "",
      r.status,
      payment?.status || "none",
      payment?.amount_local || "",
      payment?.currency_local || "",
      payment?.amount_usd || "",
      r.created_at,
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="pamoja-registrants-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
