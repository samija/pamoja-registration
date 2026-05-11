import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function GroupsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: groups } = await supabase
    .from("groups")
    .select("*, countries(name, flag:slug), registrants(id, first_name, last_name, status)")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Delegations</h1>
      <p className="text-pamoja-charcoal-light mb-8">Group registrations from churches and campuses.</p>

      {!groups || groups.length === 0 ? (
        <Card variant="elevated">
          <p className="text-pamoja-muted text-center py-8">No group registrations yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((g: {
            id: string;
            name: string;
            leader_name: string;
            leader_email: string;
            organization: string | null;
            size: number;
            created_at: string;
            countries: { name: string } | null;
            registrants: { id: string; first_name: string; last_name: string; status: string }[] | null;
          }) => {
            const confirmed = g.registrants?.filter((r) => r.status === "confirmed").length || 0;
            const total = g.registrants?.length || 0;
            const country = Array.isArray(g.countries) ? g.countries[0] : g.countries;
            return (
              <Card key={g.id} variant="elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-pamoja-charcoal text-lg">{g.name}</h3>
                    <p className="text-sm text-pamoja-muted">
                      {g.leader_name} &middot; {g.leader_email}
                    </p>
                    {g.organization && (
                      <p className="text-sm text-pamoja-charcoal-light mt-1">{g.organization}</p>
                    )}
                    <p className="text-xs text-pamoja-muted mt-1">
                      {country?.name} &middot; Registered {new Date(g.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-pamoja-charcoal">{total}</p>
                    <p className="text-xs text-pamoja-muted">members</p>
                    <Badge variant={confirmed === total && total > 0 ? "success" : "warning"} className="mt-2">
                      {confirmed}/{total} confirmed
                    </Badge>
                  </div>
                </div>
                {/* Member list */}
                {g.registrants && g.registrants.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-pamoja-border">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {g.registrants.map((r) => (
                        <Link
                          key={r.id}
                          href={`/admin/registrants/${r.id}`}
                          className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-pamoja-cream transition-colors"
                        >
                          <span>{r.first_name} {r.last_name}</span>
                          <Badge variant={r.status === "confirmed" ? "success" : "warning"} className="text-xs">
                            {r.status}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
