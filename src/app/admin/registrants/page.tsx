"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Registrant, Payment } from "@/lib/supabase/types";

type RegistrantWithPayment = Registrant & { payments: Payment[] };

export default function RegistrantsPage() {
  const [registrants, setRegistrants] = useState<RegistrantWithPayment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("registrants")
        .select("*, payments(*)")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) {
        console.error("Failed to load registrants:", error);
      } else {
        setRegistrants((data as RegistrantWithPayment[]) || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = registrants.filter((r) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.first_name.toLowerCase().includes(q) ||
      r.last_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.phone || "").includes(q);
    const matchesStatus = !statusFilter || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusBadge = (status: string) => {
    const variant = status === "confirmed" ? "success" :
                    status === "pending" ? "warning" :
                    status === "cancelled" ? "error" : "default";
    return <Badge variant={variant}>{status}</Badge>;
  };

  const paymentBadge = (payments: Payment[]) => {
    const latest = payments?.[0];
    if (!latest) return <Badge variant="default">No payment</Badge>;
    const variant = latest.status === "completed" ? "success" :
                    latest.status === "pending" ? "warning" :
                    latest.status === "failed" ? "error" : "default";
    return <Badge variant={variant}>{latest.status}</Badge>;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pamoja-charcoal">Registrants</h1>
          <p className="text-sm text-pamoja-muted mt-1">{filtered.length} of {registrants.length} records</p>
        </div>
        <a href="/api/admin/export" download>
          <Button variant="outline" size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </Button>
        </a>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="w-64">
          <Input
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: "", label: "All Statuses" },
              { value: "confirmed", label: "Confirmed" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
              { value: "waitlisted", label: "Waitlisted" },
            ]}
          />
        </div>
      </div>

      <Card variant="elevated" className="overflow-hidden p-0">
        {loading ? (
          <div className="p-8 text-center text-pamoja-muted">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-pamoja-muted">
            {registrants.length === 0 ? "No registrants yet." : "No results match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pamoja-cream/50 border-b border-pamoja-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Payment</th>
                  <th className="text-left px-4 py-3 font-medium text-pamoja-charcoal">Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pamoja-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-pamoja-cream/30">
                    <td className="px-4 py-3 font-medium">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="px-4 py-3 text-pamoja-charcoal-light">{r.email}</td>
                    <td className="px-4 py-3 text-pamoja-charcoal-light">{r.phone}</td>
                    <td className="px-4 py-3">{statusBadge(r.status)}</td>
                    <td className="px-4 py-3">{paymentBadge(r.payments)}</td>
                    <td className="px-4 py-3 text-pamoja-muted">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/registrants/${r.id}`}
                        className="text-pamoja-green-mid hover:underline text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
