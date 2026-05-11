"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RegistrantProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  gender: string | null;
  organization: string | null;
  role: string | null;
  city: string | null;
  bio: string | null;
  status: string;
  checked_in: boolean;
  directory_opt_in: boolean;
  conferences: { name: string } | null;
  countries: { name: string; currency_symbol: string } | null;
  payments: { gateway_tx_ref: string; amount_local: number; currency_local: string; status: string }[];
}

export default function MyRegistrationPage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<RegistrantProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [directoryOptIn, setDirectoryOptIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function lookup() {
    if (!email.includes("@")) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data } = await supabase
      .from("registrants")
      .select("*, conferences(name), countries(name, currency_symbol), payments(gateway_tx_ref, amount_local, currency_local, status)")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!data) {
      setError("No registration found for this email.");
    } else {
      setProfile(data as unknown as RegistrantProfile);
      setBio(data.bio || "");
      setDirectoryOptIn(data.directory_opt_in || false);
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!profile) return;
    setSaved(false);
    const supabase = createClient();
    await supabase
      .from("registrants")
      .update({ bio, directory_opt_in: directoryOptIn })
      .eq("id", profile.id);
    setSaved(true);
    setEditing(false);
  }

  const conference = profile ? (Array.isArray(profile.conferences) ? profile.conferences[0] : profile.conferences) : null;
  const country = profile ? (Array.isArray(profile.countries) ? profile.countries[0] : profile.countries) : null;

  const statusVariant = (s: string) =>
    s === "confirmed" || s === "completed" ? "success" : s === "pending" ? "warning" : "error";

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-pamoja-charcoal mb-2">My Registration</h1>
        <p className="text-pamoja-charcoal-light">View your details, manage your directory profile, and download documents.</p>
      </div>

      {!profile ? (
        <Card variant="elevated">
          <h2 className="text-lg font-semibold text-pamoja-charcoal mb-4">Find Your Registration</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter your registration email..."
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookup()}
              />
            </div>
            <Button onClick={lookup} loading={loading}>Find</Button>
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <Card variant="elevated">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-pamoja-charcoal">{profile.first_name} {profile.last_name}</h2>
                <p className="text-sm text-pamoja-muted">{profile.email}</p>
                <p className="text-sm text-pamoja-charcoal-light mt-1">{conference?.name} — {country?.name}</p>
              </div>
              <Badge variant={statusVariant(profile.status)} className="text-sm px-3 py-1">{profile.status}</Badge>
            </div>
            {profile.checked_in && (
              <Badge variant="success" className="mt-3">Checked In</Badge>
            )}
          </Card>

          {/* Profile editor */}
          <Card variant="elevated">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-pamoja-charcoal">Directory Profile</h3>
              {!editing && (
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </div>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Textarea
                    label="Bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="Tell other delegates about yourself (200 chars max)..."
                  />
                  <p className="text-xs text-pamoja-muted mt-1">{bio.length}/200</p>
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={directoryOptIn}
                    onChange={(e) => setDirectoryOptIn(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-pamoja-charcoal-light">Show my profile in the public attendee directory</span>
                </label>
                <div className="flex gap-3">
                  <Button size="sm" onClick={saveProfile}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                {profile.bio ? (
                  <p className="text-sm text-pamoja-charcoal-light">{profile.bio}</p>
                ) : (
                  <p className="text-sm text-pamoja-muted italic">No bio set. Click Edit to add one.</p>
                )}
                <p className="text-xs text-pamoja-muted mt-2">
                  Directory: {profile.directory_opt_in ? "Visible" : "Hidden"}
                </p>
                {saved && <p className="text-xs text-pamoja-green-mid mt-2">Profile saved!</p>}
              </div>
            )}
          </Card>

          {/* Payment */}
          {profile.payments && profile.payments.length > 0 && (
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Payment</h3>
              {profile.payments.map((p) => (
                <div key={p.gateway_tx_ref} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-mono text-pamoja-muted">{p.gateway_tx_ref}</p>
                    <p className="font-medium">{country?.currency_symbol}{p.amount_local?.toLocaleString()} {p.currency_local}</p>
                  </div>
                  <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
                </div>
              ))}
            </Card>
          )}

          {/* Downloads */}
          {profile.status === "confirmed" && (
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Downloads</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ButtonLink href={`/api/calendar?id=${profile.id}`} variant="outline" size="sm" download className="w-full">Calendar (.ics)</ButtonLink>
                <ButtonLink href={`/api/invitation?id=${profile.id}`} variant="outline" size="sm" target="_blank" rel="noopener noreferrer" className="w-full">Invitation Letter</ButtonLink>
                <ButtonLink href={`/api/admin/badge?id=${profile.id}`} variant="outline" size="sm" target="_blank" rel="noopener noreferrer" className="w-full">Conference Badge</ButtonLink>
              </div>
            </Card>
          )}

          {/* Share */}
          {profile.status === "confirmed" && (
            <Card variant="elevated">
              <h3 className="text-lg font-semibold text-pamoja-charcoal mb-4">Share</h3>
              <p className="text-sm text-pamoja-charcoal-light mb-3">Let others know you&apos;re attending!</p>
              <div className="flex gap-3">
                <ButtonLink href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm attending ${conference?.name || "Pamoja Africa V"} in Addis Ababa! #PamojaAfricaV #AriseAfrica`)}&url=${encodeURIComponent("https://pamoja-pi.vercel.app")}`} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">Twitter/X</ButtonLink>
                <ButtonLink href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://pamoja-pi.vercel.app")}`} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">Facebook</ButtonLink>
                <ButtonLink href={`https://wa.me/?text=${encodeURIComponent(`I'm attending ${conference?.name || "Pamoja Africa V"} in Addis Ababa! Register at https://pamoja-pi.vercel.app`)}`} target="_blank" rel="noopener noreferrer" size="sm" variant="outline">WhatsApp</ButtonLink>
              </div>
            </Card>
          )}

          <Button variant="ghost" onClick={() => { setProfile(null); setEmail(""); }}>
            Look up a different email
          </Button>
        </div>
      )}
    </div>
  );
}
