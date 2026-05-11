"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CheckinResult {
  success: boolean;
  registrant?: { id: string; name: string; conference: { name: string } };
  error?: string;
  alreadyCheckedIn?: boolean;
}

export default function CheckinPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CheckinResult[]>([]);

  async function handleCheckin(registrantId?: string) {
    const id = registrantId || parseQRInput(input);
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrantId: id,
          method: registrantId ? "qr" : "manual",
        }),
      });
      const data = await res.json();
      setResults((prev) => [data, ...prev]);
      setInput("");
    } catch {
      setResults((prev) => [{ success: false, error: "Network error" }, ...prev]);
    } finally {
      setLoading(false);
    }
  }

  function parseQRInput(raw: string): string | null {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.type === "pamoja-checkin" && parsed.id) return parsed.id;
    } catch {
      // Might be a raw UUID
    }
    // UUID pattern
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw.trim())) {
      return raw.trim();
    }
    return null;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Check-In</h1>
      <p className="text-pamoja-charcoal-light mb-8">
        Scan a QR code or enter a registrant ID to check in.
      </p>

      <Card variant="elevated" className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Scan QR code or paste registrant ID..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCheckin();
                }
              }}
            />
          </div>
          <Button onClick={() => handleCheckin()} loading={loading} disabled={!input.trim()}>
            Check In
          </Button>
        </div>
        <p className="text-xs text-pamoja-muted mt-3">
          Use a barcode/QR scanner app to scan conference badges, or manually enter the registrant UUID.
        </p>
      </Card>

      {/* Results feed */}
      <div className="space-y-3">
        {results.map((r, i) => (
          <Card key={i} variant={r.success ? "default" : "default"} className={`${r.success ? "border-pamoja-lime bg-pamoja-lime/5" : r.alreadyCheckedIn ? "border-pamoja-orange bg-pamoja-orange/5" : "border-red-300 bg-red-50"}`}>
            <div className="flex items-center justify-between">
              <div>
                {r.success && r.registrant ? (
                  <>
                    <p className="font-semibold text-pamoja-charcoal">{r.registrant.name}</p>
                    <p className="text-sm text-pamoja-muted">{r.registrant.conference?.name}</p>
                  </>
                ) : (
                  <p className="text-sm">{r.error}</p>
                )}
              </div>
              <Badge variant={r.success ? "success" : r.alreadyCheckedIn ? "warning" : "error"}>
                {r.success ? "Checked In" : r.alreadyCheckedIn ? "Already In" : "Failed"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
