import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const actionColors: Record<string, string> = {
  "bulk.confirm": "success",
  "bulk.cancel": "error",
  "bulk.export": "info",
  "checkin": "success",
  "document.approve": "success",
  "document.reject": "error",
  "settings.price_update": "warning",
  "settings.country_toggle": "warning",
  "email.blast": "info",
};

export default async function AuditLogPage() {
  const supabase = await createServerSupabaseClient();

  const { data: logs } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Audit Log</h1>
      <p className="text-pamoja-charcoal-light mb-8">All admin actions are recorded here.</p>

      {!logs || logs.length === 0 ? (
        <Card variant="elevated">
          <p className="text-pamoja-muted text-center py-8">No audit entries yet. Actions like bulk confirm, check-in, and document reviews will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log: {
            id: string;
            action: string;
            entity_type: string;
            entity_id: string | null;
            details: Record<string, unknown> | null;
            created_at: string;
            user_id: string | null;
          }) => (
            <Card key={log.id} className="py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={(actionColors[log.action] || "default") as "success" | "error" | "warning" | "info" | "default"}>
                    {log.action}
                  </Badge>
                  <span className="text-sm text-pamoja-charcoal">{log.entity_type}</span>
                  {log.entity_id && (
                    <span className="text-xs text-pamoja-muted font-mono">{log.entity_id.slice(0, 8)}</span>
                  )}
                </div>
                <span className="text-xs text-pamoja-muted">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              {log.details && (
                <p className="text-xs text-pamoja-charcoal-light mt-1">
                  {JSON.stringify(log.details).slice(0, 200)}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
