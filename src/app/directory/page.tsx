"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DirectoryProfile {
  id: string;
  first_name: string;
  last_name: string;
  organization: string | null;
  role: string | null;
  city: string | null;
  bio: string | null;
  countries: { name: string } | null;
  conferences: { name: string } | null;
}

export default function DirectoryPage() {
  const [profiles, setProfiles] = useState<DirectoryProfile[]>([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("registrants")
        .select("id, first_name, last_name, organization, role, city, bio, countries(name), conferences(name)")
        .eq("directory_opt_in", true)
        .eq("status", "confirmed")
        .order("first_name");

      setProfiles((data as unknown as DirectoryProfile[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = profiles.filter((p) => {
    const q = search.toLowerCase();
    const country = Array.isArray(p.countries) ? p.countries[0] : p.countries;
    const matchesSearch =
      !q ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      (p.organization || "").toLowerCase().includes(q) ||
      (p.city || "").toLowerCase().includes(q);
    const matchesCountry = !countryFilter || country?.name === countryFilter;
    return matchesSearch && matchesCountry;
  });

  // Get unique countries
  const countryNames = [...new Set(profiles.map((p) => {
    const c = Array.isArray(p.countries) ? p.countries[0] : p.countries;
    return c?.name || "";
  }).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-pamoja-charcoal mb-2">
          Attendee Directory
        </h1>
        <p className="text-pamoja-charcoal-light max-w-xl mx-auto">
          Connect with fellow Pamoja Africa V attendees. Only confirmed registrants who opted in are shown.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <div className="w-72">
          <Input
            placeholder="Search by name, organization, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {countryNames.length > 1 && (
          <div className="w-44">
            <Select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              options={[
                { value: "", label: "All Countries" },
                ...countryNames.map((n) => ({ value: n, label: n })),
              ]}
            />
          </div>
        )}
      </div>

      <p className="text-sm text-pamoja-muted text-center mb-6">{filtered.length} attendees</p>

      {loading ? (
        <p className="text-center text-pamoja-muted py-12">Loading directory...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-pamoja-muted py-12">No attendees found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => {
            const country = Array.isArray(p.countries) ? p.countries[0] : p.countries;
            const conference = Array.isArray(p.conferences) ? p.conferences[0] : p.conferences;
            return (
              <Card key={p.id} variant="elevated" className="flex flex-col">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-pamoja-lime/20 flex items-center justify-center text-pamoja-green-mid font-bold text-sm flex-shrink-0">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-pamoja-charcoal truncate">
                      {p.first_name} {p.last_name}
                    </p>
                    {p.role && (
                      <p className="text-xs text-pamoja-muted">{p.role}</p>
                    )}
                  </div>
                </div>
                {p.bio && (
                  <p className="text-sm text-pamoja-charcoal-light leading-relaxed mb-3 line-clamp-3">
                    {p.bio}
                  </p>
                )}
                <div className="mt-auto pt-3 border-t border-pamoja-border flex flex-wrap gap-2">
                  {p.organization && <Badge variant="default">{p.organization}</Badge>}
                  {p.city && <Badge variant="default">{p.city}</Badge>}
                  {country?.name && <Badge variant="info">{country.name}</Badge>}
                  {conference?.name && <Badge variant="success">{conference.name}</Badge>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
