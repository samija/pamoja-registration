import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateQRCode } from "@/lib/qr/generate";

export const dynamic = "force-dynamic";

/** Generate a printable badge HTML for a registrant */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const registrantId = req.nextUrl.searchParams.get("id");
  if (!registrantId) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { data: reg } = await supabase
    .from("registrants")
    .select("*, countries(name), conferences(name)")
    .eq("id", registrantId)
    .single();

  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const qrDataUrl = await generateQRCode(reg.id);

  const country = Array.isArray(reg.countries) ? reg.countries[0] : reg.countries;
  const conference = Array.isArray(reg.conferences) ? reg.conferences[0] : reg.conferences;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Badge — ${reg.first_name} ${reg.last_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Inter:wght@400;500&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f5f5f5; display: flex; justify-content: center; padding: 20px; }
    .badge { width: 340px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .badge-header { background: #0A1002; padding: 24px; text-align: center; }
    .badge-header h1 { color: #8DCF3D; font-family: 'Montserrat', sans-serif; font-size: 20px; font-weight: 700; }
    .badge-header p { color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 4px; }
    .badge-body { padding: 24px; text-align: center; }
    .badge-name { font-family: 'Montserrat', sans-serif; font-size: 22px; font-weight: 700; color: #2C2C2C; margin-bottom: 4px; }
    .badge-role { font-size: 14px; color: #9B9B8F; margin-bottom: 4px; }
    .badge-org { font-size: 13px; color: #4A4A4A; margin-bottom: 16px; }
    .badge-conference { display: inline-block; background: #8DCF3D20; color: #5C8727; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 20px; margin-bottom: 16px; }
    .badge-country { font-size: 12px; color: #9B9B8F; margin-bottom: 20px; }
    .badge-qr img { width: 160px; height: 160px; }
    .badge-id { font-size: 10px; color: #9B9B8F; margin-top: 12px; font-family: monospace; }
    .badge-footer { background: #FAF7F2; padding: 12px; text-align: center; font-size: 10px; color: #9B9B8F; }
    @media print { body { background: white; padding: 0; } .badge { box-shadow: none; border: 1px solid #eee; } }
  </style>
</head>
<body>
  <div class="badge">
    <div class="badge-header">
      <h1>PAMOJA</h1>
      <p>Africa V &middot; Addis Ababa 2028</p>
    </div>
    <div class="badge-body">
      <div class="badge-name">${reg.first_name} ${reg.last_name}</div>
      <div class="badge-role">${reg.role || ""}</div>
      <div class="badge-org">${reg.organization || ""}</div>
      <div class="badge-conference">${conference?.name || ""}</div>
      <div class="badge-country">${country?.name || ""}</div>
      <div class="badge-qr"><img src="${qrDataUrl}" alt="QR" /></div>
      <div class="badge-id">${reg.id}</div>
    </div>
    <div class="badge-footer">Scan QR at check-in &middot; runpamoja.org</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
