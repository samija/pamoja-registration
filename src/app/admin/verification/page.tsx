"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Document } from "@/lib/supabase/types";

type DocWithRegistrant = Document & {
  registrants: { first_name: string; last_name: string; email: string } | null;
};

export default function VerificationPage() {
  const [docs, setDocs] = useState<DocWithRegistrant[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [loading, setLoading] = useState(true);

  async function loadDocs() {
    const supabase = createClient();
    let query = supabase
      .from("documents")
      .select("*, registrants(first_name, last_name, email)")
      .order("created_at", { ascending: false });

    if (filter !== "all") {
      query = query.eq("status", filter);
    }

    const { data } = await query.limit(50);
    setDocs((data as DocWithRegistrant[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDocs();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function review(documentId: string, status: "approved" | "rejected") {
    const res = await fetch("/api/documents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, status }),
    });

    if (res.ok) {
      setDocs((prev) => prev.map((d) => (d.id === documentId ? { ...d, status } : d)));
    }
  }

  const statusVariant = (s: string) =>
    s === "approved" ? "success" : s === "rejected" ? "error" : "warning";

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Document Verification</h1>
      <p className="text-pamoja-charcoal-light mb-6">Review uploaded identification documents.</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors capitalize ${
              filter === f
                ? "bg-pamoja-lime text-pamoja-green-deep font-semibold"
                : "bg-white text-pamoja-charcoal-light border border-pamoja-border hover:bg-pamoja-cream"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-pamoja-muted">Loading...</p>
      ) : docs.length === 0 ? (
        <Card variant="elevated">
          <p className="text-pamoja-muted text-center py-8">
            No {filter === "all" ? "" : filter} documents to review.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {docs.map((doc) => {
            const reg = Array.isArray(doc.registrants) ? doc.registrants[0] : doc.registrants;
            return (
              <Card key={doc.id} variant="elevated">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-pamoja-charcoal">
                      {reg?.first_name} {reg?.last_name}
                    </p>
                    <p className="text-sm text-pamoja-muted">{reg?.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="default">{doc.type.replace("_", " ")}</Badge>
                      <span className="text-xs text-pamoja-muted">{doc.file_name}</span>
                    </div>
                    {doc.review_note && (
                      <p className="text-xs text-pamoja-charcoal-light mt-2 italic">{doc.review_note}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant(doc.status)}>{doc.status}</Badge>
                    {doc.status === "pending" && (
                      <div className="flex gap-2 ml-3">
                        <Button size="sm" onClick={() => review(doc.id, "approved")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => review(doc.id, "rejected")}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
