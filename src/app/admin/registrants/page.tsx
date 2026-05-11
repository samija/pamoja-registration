"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRealtime } from "@/hooks/use-realtime";
import { showToast, ToastContainer } from "@/components/ui/toast";
import type { Registrant, Payment } from "@/lib/supabase/types";

type RegistrantWithPayment = Registrant & { payments: Payment[] };

export default function RegistrantsPage() {
  const [registrants, setRegistrants] = useState<RegistrantWithPayment[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const reload = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("registrants")
      .select("*, payments(*)")
      .order("created_at", { ascending: false })
      .limit(200);
    setRegistrants((data as RegistrantWithPayment[]) || []);
    setLoading(false);
  }, []);

  // Real-time: new registrations
  useRealtime({
    table: "registrants",
    onInsert: (payload) => {
      showToast(`New registration: ${payload.first_name} ${payload.last_name}`, "success");
      reload();
    },
    onUpdate: () => reload(),
  });

  useEffect(() => { reload(); }, [reload]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((r) => r.id)));
    }
  }

  async function bulkAction(action: "confirm" | "cancel" | "export") {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBulkLoading(true);

    if (action === "export") {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pamoja-selected-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const res = await fetch("/api/admin/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`${data.updated} registrants ${action === "confirm" ? "confirmed" : "cancelled"}`, "success");
        setSelected(new Set());
        reload();
      }
    }
    setBulkLoading(false);
  }

  // Remove duplicate — reload is already called via useEffect above
  useEffect(() => {
    // no-op, load handled by reload()
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

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bg-pamoja-green-deep text-white rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-sm">{selected.size} selected</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => bulkAction("confirm")} loading={bulkLoading}>Confirm</Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => bulkAction("cancel")} loading={bulkLoading}>Cancel</Button>
            <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => bulkAction("export")} loading={bulkLoading}>Export Selected</Button>
            <Button size="sm" variant="ghost" className="text-white/60" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      <ToastContainer />

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
                  <th className="px-4 py-3 w-10">
                    <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 rounded" />
                  </th>
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
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggleSelect(r.id)} className="w-4 h-4 rounded" />
                    </td>
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
