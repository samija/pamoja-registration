import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function getAnalytics() {
  const supabase = await createServerSupabaseClient();

  const [
    { data: registrants },
    { data: payments },
    { data: checkins },
  ] = await Promise.all([
    supabase.from("registrants").select("id, status, gender, role, city, country_id, conference_id, created_at, checked_in, countries(name), conferences(name)"),
    supabase.from("payments").select("amount_local, currency_local, amount_usd, status, created_at").eq("status", "completed"),
    supabase.from("checkins").select("id"),
  ]);

  // By status
  const byStatus: Record<string, number> = {};
  registrants?.forEach((r: { status: string }) => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
  });

  // By gender
  const byGender: Record<string, number> = {};
  registrants?.forEach((r: { gender: string | null }) => {
    const g = r.gender || "unspecified";
    byGender[g] = (byGender[g] || 0) + 1;
  });

  // By role
  const byRole: Record<string, number> = {};
  registrants?.forEach((r: { role: string | null }) => {
    const role = r.role || "unspecified";
    byRole[role] = (byRole[role] || 0) + 1;
  });

  // By country
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byCountry: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registrants?.forEach((r: any) => {
    const c = Array.isArray(r.countries) ? r.countries[0] : r.countries;
    const name = c?.name || "Unknown";
    byCountry[name] = (byCountry[name] || 0) + 1;
  });

  // By conference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const byConference: Record<string, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registrants?.forEach((r: any) => {
    const c = Array.isArray(r.conferences) ? r.conferences[0] : r.conferences;
    const name = c?.name || "Unknown";
    byConference[name] = (byConference[name] || 0) + 1;
  });

  // Revenue by currency
  const revenueByCurrency: Record<string, number> = {};
  let totalUsd = 0;
  payments?.forEach((p: { amount_local: number; currency_local: string; amount_usd: number }) => {
    revenueByCurrency[p.currency_local] = (revenueByCurrency[p.currency_local] || 0) + p.amount_local;
    totalUsd += p.amount_usd || 0;
  });

  // Registration trend (last 30 days)
  const now = new Date();
  const trend: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    trend[d.toISOString().slice(0, 10)] = 0;
  }
  registrants?.forEach((r: { created_at: string }) => {
    const day = r.created_at.slice(0, 10);
    if (trend[day] !== undefined) trend[day]++;
  });

  return {
    total: registrants?.length || 0,
    checkedIn: checkins?.length || 0,
    byStatus,
    byGender,
    byRole,
    byCountry,
    byConference,
    revenueByCurrency,
    totalUsd,
    trend,
  };
}

function BarChart({ data, color = "bg-pamoja-lime" }: { data: Record<string, number>; color?: string }) {
  const max = Math.max(...Object.values(data), 1);
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  return (
    <div className="space-y-2">
      {sorted.map(([label, count]) => (
        <div key={label} className="flex items-center gap-3">
          <span className="text-sm text-pamoja-charcoal w-28 truncate capitalize">{label}</span>
          <div className="flex-1 h-6 bg-pamoja-border/30 rounded-full overflow-hidden">
            <div
              className={`h-full ${color} rounded-full transition-all`}
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-pamoja-charcoal w-8 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage() {
  const stats = await getAnalytics();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Analytics</h1>
      <p className="text-pamoja-charcoal-light mb-8">Registration demographics and revenue breakdown.</p>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="elevated">
          <CardContent>
            <p className="text-xs text-pamoja-muted">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-xs text-pamoja-muted">Checked In</p>
            <p className="text-2xl font-bold text-pamoja-green-mid">{stats.checkedIn}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-xs text-pamoja-muted">Revenue (USD)</p>
            <p className="text-2xl font-bold">${stats.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardContent>
            <p className="text-xs text-pamoja-muted">Check-in Rate</p>
            <p className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">By Status</h3>
          <BarChart data={stats.byStatus} />
        </Card>
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">By Country</h3>
          <BarChart data={stats.byCountry} color="bg-pamoja-orange" />
        </Card>
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">By Gender</h3>
          <BarChart data={stats.byGender} color="bg-pamoja-green-mid" />
        </Card>
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">By Conference</h3>
          <BarChart data={stats.byConference} />
        </Card>
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">By Role</h3>
          <BarChart data={stats.byRole} color="bg-pamoja-orange" />
        </Card>
        <Card variant="elevated">
          <h3 className="text-lg font-semibold mb-4">Revenue by Currency</h3>
          <div className="space-y-3">
            {Object.entries(stats.revenueByCurrency).map(([currency, amount]) => (
              <div key={currency} className="flex justify-between items-center">
                <span className="text-sm font-medium text-pamoja-charcoal">{currency}</span>
                <span className="text-lg font-bold">{amount.toLocaleString()}</span>
              </div>
            ))}
            <hr className="border-pamoja-border" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Total USD</span>
              <span className="text-lg font-bold text-pamoja-green-mid">${stats.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Trend */}
      <Card variant="elevated">
        <h3 className="text-lg font-semibold mb-4">Registration Trend (30 days)</h3>
        <div className="flex items-end gap-1 h-32">
          {Object.entries(stats.trend).map(([date, count]) => {
            const max = Math.max(...Object.values(stats.trend), 1);
            const height = (count / max) * 100;
            return (
              <div key={date} className="flex-1 flex flex-col items-center justify-end" title={`${date}: ${count}`}>
                <div
                  className="w-full bg-pamoja-lime rounded-t transition-all hover:bg-pamoja-lime/80"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-pamoja-muted">{Object.keys(stats.trend)[0]}</span>
          <span className="text-xs text-pamoja-muted">{Object.keys(stats.trend).pop()}</span>
        </div>
      </Card>
    </div>
  );
}
