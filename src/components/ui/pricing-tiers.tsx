"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "./badge";

interface Tier {
  id: string;
  name: string;
  label: string;
  price_local: number;
  starts_at: string;
  ends_at: string;
}

interface Props {
  countrySlug: string;
  conferenceSlug: string;
  currencySymbol: string;
  basePrice: number;
}

export function PricingTiers({ countrySlug, conferenceSlug, currencySymbol, basePrice }: Props) {
  const [tiers, setTiers] = useState<Tier[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: cc } = await supabase
        .from("country_conferences")
        .select("id, countries!inner(slug), conferences!inner(slug)")
        .eq("countries.slug", countrySlug)
        .eq("conferences.slug", conferenceSlug)
        .single();

      if (!cc) return;

      const { data } = await supabase
        .from("pricing_tiers")
        .select("*")
        .eq("country_conference_id", cc.id)
        .eq("is_active", true)
        .order("starts_at");

      setTiers((data as Tier[]) || []);
    }
    load();
  }, [countrySlug, conferenceSlug]);

  if (tiers.length === 0) return null;

  const now = new Date();
  const activeTier = tiers.find((t) => new Date(t.starts_at) <= now && new Date(t.ends_at) >= now);
  const nextTier = tiers.find((t) => new Date(t.starts_at) > now);

  return (
    <div className="mt-4">
      <p className="text-xs text-pamoja-muted mb-2 uppercase tracking-wider">Pricing Tiers</p>
      <div className="flex gap-2 flex-wrap">
        {tiers.map((t) => {
          const isActive = t.id === activeTier?.id;
          const isPast = new Date(t.ends_at) < now;
          return (
            <div
              key={t.id}
              className={`px-3 py-2 rounded-lg text-xs border transition-colors ${
                isActive
                  ? "border-pamoja-lime bg-pamoja-lime/10 text-pamoja-green-mid font-semibold"
                  : isPast
                  ? "border-pamoja-border/50 text-pamoja-muted line-through opacity-60"
                  : "border-pamoja-border text-pamoja-charcoal-light"
              }`}
            >
              <span>{t.label}</span>
              <span className="ml-2 font-bold">{currencySymbol}{t.price_local.toLocaleString()}</span>
              {isActive && <Badge variant="success" className="ml-2 text-[10px]">Active</Badge>}
            </div>
          );
        })}
      </div>
      {nextTier && activeTier && (
        <p className="text-xs text-pamoja-orange mt-2">
          Price increases to {currencySymbol}{nextTier.price_local.toLocaleString()} on {new Date(activeTier.ends_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}
    </div>
  );
}
