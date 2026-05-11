import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function RegistrantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: registrant } = await supabase
    .from("registrants")
    .select("*, countries(name, slug, currency_symbol, currency), conferences(name, slug), payments(*)")
    .eq("id", id)
    .single();

  if (!registrant) notFound();

  const statusVariant = (s: string) =>
    s === "confirmed" ? "success" : s === "pending" ? "warning" : s === "cancelled" ? "error" : "default";

  const paymentVariant = (s: string) =>
    s === "completed" ? "success" : s === "pending" ? "warning" : s === "failed" ? "error" : "default";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm">
        <Link href="/admin/registrants" className="text-pamoja-green-mid hover:underline">
          Registrants
        </Link>
        <span className="text-pamoja-muted">/</span>
        <span className="text-pamoja-charcoal">{registrant.first_name} {registrant.last_name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pamoja-charcoal">
            {registrant.first_name} {registrant.last_name}
          </h1>
          <p className="text-pamoja-charcoal-light mt-1">{registrant.email}</p>
        </div>
        <Badge variant={statusVariant(registrant.status)}>{registrant.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card variant="elevated">
          <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Personal Details</h3>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Phone</dt>
                <dd className="text-pamoja-charcoal">{registrant.phone || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Gender</dt>
                <dd className="text-pamoja-charcoal capitalize">{registrant.gender || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Organization</dt>
                <dd className="text-pamoja-charcoal">{registrant.organization || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Role</dt>
                <dd className="text-pamoja-charcoal">{registrant.role || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">City</dt>
                <dd className="text-pamoja-charcoal">{registrant.city || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Registered</dt>
                <dd className="text-pamoja-charcoal">{new Date(registrant.created_at).toLocaleString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Conference & Country */}
        <Card variant="elevated">
          <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Registration</h3>
          <CardContent>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Conference</dt>
                <dd className="text-pamoja-charcoal font-medium">{registrant.conferences?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Country</dt>
                <dd className="text-pamoja-charcoal">{registrant.countries?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Locale</dt>
                <dd className="text-pamoja-charcoal">{registrant.locale}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-pamoja-muted">Status</dt>
                <dd><Badge variant={statusVariant(registrant.status)}>{registrant.status}</Badge></dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card variant="elevated" className="mt-6">
        <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Payment History</h3>
        {registrant.payments && registrant.payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-pamoja-border">
                <tr>
                  <th className="text-left py-2 font-medium text-pamoja-charcoal">Reference</th>
                  <th className="text-left py-2 font-medium text-pamoja-charcoal">Gateway</th>
                  <th className="text-right py-2 font-medium text-pamoja-charcoal">Amount</th>
                  <th className="text-right py-2 font-medium text-pamoja-charcoal">USD</th>
                  <th className="text-left py-2 font-medium text-pamoja-charcoal">Status</th>
                  <th className="text-left py-2 font-medium text-pamoja-charcoal">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pamoja-border">
                {registrant.payments.map((p: {
                  id: string;
                  gateway_tx_ref: string;
                  gateway: string;
                  amount_local: number;
                  currency_local: string;
                  amount_usd: number;
                  status: string;
                  paid_at: string | null;
                  created_at: string;
                }) => (
                  <tr key={p.id}>
                    <td className="py-2 text-pamoja-charcoal-light font-mono text-xs">{p.gateway_tx_ref}</td>
                    <td className="py-2 capitalize">{p.gateway}</td>
                    <td className="py-2 text-right font-medium">
                      {registrant.countries?.currency_symbol}{p.amount_local?.toLocaleString()} {p.currency_local}
                    </td>
                    <td className="py-2 text-right text-pamoja-muted">${p.amount_usd?.toFixed(2)}</td>
                    <td className="py-2"><Badge variant={paymentVariant(p.status)}>{p.status}</Badge></td>
                    <td className="py-2 text-pamoja-muted">
                      {new Date(p.paid_at || p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-pamoja-muted">No payments recorded</p>
        )}
      </Card>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/admin/registrants" variant="outline">Back to List</ButtonLink>
        {registrant.status === "confirmed" && (
          <ButtonLink href={`/api/admin/badge?id=${registrant.id}`} variant="secondary" target="_blank" rel="noopener noreferrer">
            Print Badge
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
