import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: totalRegistrants },
    { count: confirmed },
    { count: pending },
    { data: revenueData },
    { data: recentRegistrants },
    { data: countryStats },
  ] = await Promise.all([
    supabase.from("registrants").select("*", { count: "exact", head: true }),
    supabase.from("registrants").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
    supabase.from("registrants").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("payments").select("amount_usd").eq("status", "completed"),
    supabase
      .from("registrants")
      .select("id, first_name, last_name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("registrants")
      .select("country_id, countries(name, slug)")
      .then(({ data }) => {
        // Count by country
        const counts: Record<string, { name: string; slug: string; count: number }> = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.forEach((r: any) => {
          const c = Array.isArray(r.countries) ? r.countries[0] : r.countries;
          const name = c?.name || "Unknown";
          const slug = c?.slug || "";
          if (!counts[r.country_id]) counts[r.country_id] = { name, slug, count: 0 };
          counts[r.country_id].count++;
        });
        return { data: Object.values(counts) };
      }),
  ]);

  const totalRevenue = revenueData?.reduce((sum: number, p: { amount_usd: number }) => sum + (p.amount_usd || 0), 0) || 0;

  return {
    totalRegistrants: totalRegistrants || 0,
    confirmed: confirmed || 0,
    pending: pending || 0,
    totalRevenue,
    recentRegistrants: recentRegistrants || [],
    countryStats: countryStats || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pamoja-charcoal">Dashboard</h1>
        <p className="text-pamoja-charcoal-light mt-1">Pamoja Africa V Registration Overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <Card variant="elevated">
          <CardContent>
            <p className="text-sm text-pamoja-muted">Total Registrants</p>
            <p className="text-3xl font-bold text-pamoja-charcoal mt-1">{stats.totalRegistrants}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-sm text-pamoja-muted">Confirmed</p>
            <p className="text-3xl font-bold text-pamoja-green-mid mt-1">{stats.confirmed}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-sm text-pamoja-muted">Pending</p>
            <p className="text-3xl font-bold text-pamoja-orange mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-sm text-pamoja-muted">Revenue (USD)</p>
            <p className="text-3xl font-bold text-pamoja-charcoal mt-1">
              ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Country */}
        <Card variant="elevated">
          <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">By Country</h3>
          <div className="space-y-3">
            {stats.countryStats.map((c: { name: string; slug: string; count: number }) => (
              <div key={c.slug} className="flex items-center justify-between">
                <span className="text-sm text-pamoja-charcoal">{c.name}</span>
                <Badge variant="default">{c.count}</Badge>
              </div>
            ))}
            {stats.countryStats.length === 0 && (
              <p className="text-sm text-pamoja-muted">No registrations yet</p>
            )}
          </div>
        </Card>

        {/* Recent Registrations */}
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-pamoja-charcoal">Recent Registrations</h3>
            <Link href="/admin/registrants" className="text-sm text-pamoja-green-mid hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentRegistrants.map((r: { id: string; first_name: string; last_name: string; email: string; status: string; created_at: string }) => (
              <Link
                key={r.id}
                href={`/admin/registrants/${r.id}`}
                className="flex items-center justify-between py-2 hover:bg-pamoja-cream/50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-pamoja-charcoal">{r.first_name} {r.last_name}</p>
                  <p className="text-xs text-pamoja-muted">{r.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={r.status === "confirmed" ? "success" : r.status === "pending" ? "warning" : "default"}>
                    {r.status}
                  </Badge>
                  <p className="text-xs text-pamoja-muted mt-1">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
            {stats.recentRegistrants.length === 0 && (
              <p className="text-sm text-pamoja-muted">No registrations yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
