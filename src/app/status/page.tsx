"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatusResult {
  id: string;
  name: string;
  email: string;
  status: string;
  checkedIn: boolean;
  registeredAt: string;
  conference: { name: string } | null;
  country: { name: string; currency_symbol: string } | null;
  payments: { txRef: string; amount: number; currency: string; status: string; paidAt: string | null }[];
}

export default function StatusPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StatusResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);

    const isEmail = query.includes("@");
    const param = isEmail ? `email=${encodeURIComponent(query)}` : `tx_ref=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(`/api/status?${param}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const statusVariant = (s: string) =>
    s === "confirmed" || s === "completed" ? "success" : s === "pending" ? "warning" : s === "cancelled" || s === "failed" ? "error" : "default";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-pamoja-charcoal mb-2">Check Your Status</h1>
        <p className="text-pamoja-charcoal-light">
          Enter your email address or payment reference to check your registration status.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Email address or payment reference..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <Button type="submit" loading={loading}>Search</Button>
      </form>

      {error && (
        <Card className="text-center py-8">
          <p className="text-pamoja-charcoal-light">{error}</p>
          <p className="text-sm text-pamoja-muted mt-2">
            If you recently registered, please wait a few minutes and try again.
          </p>
        </Card>
      )}

      {results && results.map((r) => {
        const conf = Array.isArray(r.conference) ? r.conference[0] : r.conference;
        const country = Array.isArray(r.country) ? r.country[0] : r.country;
        return (
          <Card key={r.id} variant="elevated" className="mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-pamoja-charcoal">{r.name}</h2>
                <p className="text-sm text-pamoja-muted">{r.email}</p>
              </div>
              <Badge variant={statusVariant(r.status)} className="text-sm px-3 py-1">{r.status}</Badge>
            </div>

            <div className="bg-pamoja-cream rounded-lg p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-pamoja-muted">Conference</span>
                <span className="font-medium">{conf?.name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pamoja-muted">Country</span>
                <span className="font-medium">{country?.name || "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pamoja-muted">Registered</span>
                <span className="font-medium">{new Date(r.registeredAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-pamoja-muted">Checked In</span>
                <span className="font-medium">{r.checkedIn ? "Yes" : "Not yet"}</span>
              </div>
            </div>

            {/* Payments */}
            {r.payments && r.payments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-pamoja-charcoal mb-2">Payments</h3>
                {r.payments.map((p) => (
                  <div key={p.txRef} className="flex items-center justify-between py-2 border-t border-pamoja-border text-sm">
                    <div>
                      <span className="font-mono text-xs text-pamoja-muted">{p.txRef}</span>
                      <p className="font-medium">{country?.currency_symbol}{p.amount?.toLocaleString()} {p.currency}</p>
                    </div>
                    <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            )}

            {/* Actions for confirmed registrants */}
            {r.status === "confirmed" && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-pamoja-border">
                <ButtonLink href={`/api/invitation?id=${r.id}`} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">
                  Download Invitation Letter
                </ButtonLink>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
