"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showToast, ToastContainer } from "@/components/ui/toast";

interface Country {
  id: string;
  slug: string;
  name: string;
  name_local: string;
  currency: string;
  currency_symbol: string;
  locale: string;
  payment_gateway: string;
  contact_email: string;
  is_active: boolean;
}

interface Conference {
  id: string;
  slug: string;
  name: string;
  year: number;
  start_date: string;
  end_date: string;
  location: string;
  is_active: boolean;
}

interface Pricing {
  id: string;
  country_id: string;
  conference_id: string;
  price_local: number;
  currency: string;
}

export default function SettingsPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [editingPrice, setEditingPrice] = useState<{ countryId: string; confId: string; value: string } | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: c }, { data: conf }, { data: p }] = await Promise.all([
        supabase.from("countries").select("*").order("name"),
        supabase.from("conferences").select("*").order("year"),
        supabase.from("country_conferences").select("*"),
      ]);
      setCountries((c as Country[]) || []);
      setConferences((conf as Conference[]) || []);
      setPricings((p as Pricing[]) || []);
    }
    load();
  }, []);

  function getPrice(countryId: string, confId: string): Pricing | undefined {
    return pricings.find((p) => p.country_id === countryId && p.conference_id === confId);
  }

  async function updatePrice(countryId: string, confId: string, newPrice: number) {
    const supabase = createClient();
    const existing = getPrice(countryId, confId);
    const country = countries.find((c) => c.id === countryId);

    if (existing) {
      await supabase.from("country_conferences").update({ price_local: newPrice }).eq("id", existing.id);
      setPricings((prev) => prev.map((p) => p.id === existing.id ? { ...p, price_local: newPrice } : p));
    } else {
      const { data } = await supabase.from("country_conferences").insert({
        country_id: countryId,
        conference_id: confId,
        price_local: newPrice,
        currency: country?.currency || "USD",
      }).select("*").single();
      if (data) setPricings((prev) => [...prev, data as Pricing]);
    }
    showToast("Price updated", "success");
    setEditingPrice(null);
  }

  async function toggleCountry(id: string, active: boolean) {
    const supabase = createClient();
    await supabase.from("countries").update({ is_active: active }).eq("id", id);
    setCountries((prev) => prev.map((c) => c.id === id ? { ...c, is_active: active } : c));
    showToast(active ? "Country enabled" : "Country disabled", "info");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Settings</h1>
      <p className="text-pamoja-charcoal-light mb-8">Manage countries, conferences, and pricing.</p>

      <ToastContainer />

      {/* Countries */}
      <Card variant="elevated" className="mb-8">
        <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Countries</h3>
        <div className="space-y-3">
          {countries.map((c) => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-pamoja-border last:border-0">
              <div>
                <p className="font-medium text-pamoja-charcoal">{c.name} <span className="text-pamoja-muted">({c.name_local})</span></p>
                <p className="text-xs text-pamoja-muted">{c.currency} — {c.payment_gateway} — {c.contact_email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={c.is_active ? "success" : "default"}>{c.is_active ? "Active" : "Disabled"}</Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleCountry(c.id, !c.is_active)}
                >
                  {c.is_active ? "Disable" : "Enable"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pricing Matrix */}
      <Card variant="elevated">
        <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Pricing Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-pamoja-border">
              <tr>
                <th className="text-left py-2 font-medium">Country</th>
                {conferences.map((conf) => (
                  <th key={conf.id} className="text-right py-2 font-medium">{conf.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-pamoja-border/50">
              {countries.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 font-medium">{c.name} ({c.currency_symbol})</td>
                  {conferences.map((conf) => {
                    const price = getPrice(c.id, conf.id);
                    const isEditing = editingPrice?.countryId === c.id && editingPrice?.confId === conf.id;
                    return (
                      <td key={conf.id} className="py-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center gap-1 justify-end">
                            <Input
                              type="number"
                              value={editingPrice.value}
                              onChange={(e) => setEditingPrice({ ...editingPrice, value: e.target.value })}
                              className="w-28 text-right"
                            />
                            <Button size="sm" onClick={() => updatePrice(c.id, conf.id, parseFloat(editingPrice.value))}>Save</Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingPrice({ countryId: c.id, confId: conf.id, value: String(price?.price_local || 0) })}
                            className="hover:bg-pamoja-cream px-2 py-1 rounded transition-colors"
                          >
                            {price ? `${c.currency_symbol}${price.price_local.toLocaleString()}` : <span className="text-pamoja-muted">—</span>}
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-pamoja-muted mt-3">Click any price to edit. Changes are saved immediately.</p>
      </Card>
    </div>
  );
}
