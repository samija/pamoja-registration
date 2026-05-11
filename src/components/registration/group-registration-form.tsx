"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { CountryConfig } from "@/config/countries";
import type { ConferencePricing } from "@/config/conferences";
import { conferences } from "@/config/conferences";

interface Props {
  countrySlug: string;
  countryConfig: CountryConfig;
  pricing: ConferencePricing[];
}

interface Member {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  role: string;
}

const emptyMember = (): Member => ({
  firstName: "", lastName: "", email: "", phone: "", gender: "", role: "",
});

export function GroupRegistrationForm({ countrySlug, countryConfig, pricing }: Props) {
  const [conferenceId, setConferenceId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [organization, setOrganization] = useState("");
  const [members, setMembers] = useState<Member[]>([emptyMember(), emptyMember()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  function addMember() {
    setMembers((prev) => [...prev, emptyMember()]);
  }

  function removeMember(idx: number) {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateMember(idx: number, field: keyof Member, value: string) {
    setMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  }

  const selectedPricing = pricing.find((p) => p.conferenceId === conferenceId);
  const totalAmount = selectedPricing ? selectedPricing.priceLocal * members.length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/register/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countrySlug,
          conferenceId,
          groupName,
          leaderName,
          leaderEmail,
          leaderPhone,
          organization,
          members,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          setResult({ success: true, message: `${members.length} members registered successfully!` });
        }
      } else {
        setResult({ success: false, message: data.error || "Registration failed" });
      }
    } catch {
      setResult({ success: false, message: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Conference Selection */}
      <Card variant="elevated" className="mb-6">
        <h2 className="text-lg font-semibold text-pamoja-charcoal mb-4">Conference</h2>
        <Select
          label="Select Conference"
          value={conferenceId}
          onChange={(e) => setConferenceId(e.target.value)}
          placeholder="Choose a conference"
          options={pricing.map((p) => {
            const conf = conferences.find((c) => c.id === p.conferenceId);
            return {
              value: p.conferenceId,
              label: `${conf?.name || p.conferenceId} — ${countryConfig.currencySymbol}${p.priceLocal.toLocaleString()} per person`,
            };
          })}
          required
        />
      </Card>

      {/* Group Info */}
      <Card variant="elevated" className="mb-6">
        <h2 className="text-lg font-semibold text-pamoja-charcoal mb-4">Delegation Info</h2>
        <div className="space-y-4">
          <Input label="Group / Delegation Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Addis Ababa University CCC" required />
          <Input label="Organization / Church" value={organization} onChange={(e) => setOrganization(e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Leader Name" value={leaderName} onChange={(e) => setLeaderName(e.target.value)} required />
            <Input label="Leader Email" type="email" value={leaderEmail} onChange={(e) => setLeaderEmail(e.target.value)} required />
          </div>
          <Input label="Leader Phone" type="tel" value={leaderPhone} onChange={(e) => setLeaderPhone(e.target.value)} placeholder={countryConfig.contactPhone} />
        </div>
      </Card>

      {/* Members */}
      <Card variant="elevated" className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-pamoja-charcoal">
            Members ({members.length})
          </h2>
          <Button type="button" variant="outline" size="sm" onClick={addMember}>
            + Add Member
          </Button>
        </div>

        <div className="space-y-6">
          {members.map((m, idx) => (
            <div key={idx} className="border border-pamoja-border rounded-lg p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-pamoja-charcoal">Member {idx + 1}</span>
                {members.length > 1 && (
                  <button type="button" onClick={() => removeMember(idx)} className="text-xs text-red-500 hover:underline">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="First Name" value={m.firstName} onChange={(e) => updateMember(idx, "firstName", e.target.value)} required />
                <Input placeholder="Last Name" value={m.lastName} onChange={(e) => updateMember(idx, "lastName", e.target.value)} required />
                <Input placeholder="Email" type="email" value={m.email} onChange={(e) => updateMember(idx, "email", e.target.value)} required />
                <Input placeholder="Phone" type="tel" value={m.phone} onChange={(e) => updateMember(idx, "phone", e.target.value)} />
                <Select
                  value={m.gender}
                  onChange={(e) => updateMember(idx, "gender", e.target.value)}
                  placeholder="Gender"
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
                <Input placeholder="Role (Student, Staff...)" value={m.role} onChange={(e) => updateMember(idx, "role", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary & Submit */}
      {selectedPricing && (
        <Card variant="elevated" className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-pamoja-muted">{members.length} members &times; {countryConfig.currencySymbol}{selectedPricing.priceLocal.toLocaleString()}</p>
              <p className="text-2xl font-bold text-pamoja-charcoal mt-1">
                {countryConfig.currencySymbol}{totalAmount.toLocaleString()} {selectedPricing.currency}
              </p>
            </div>
            <Button type="submit" loading={loading} size="lg">
              Register Group
            </Button>
          </div>
        </Card>
      )}

      {result && (
        <div className={`p-4 rounded-lg text-sm ${result.success ? "bg-pamoja-lime/10 text-pamoja-green-mid" : "bg-red-50 text-red-600"}`}>
          {result.message}
        </div>
      )}
    </form>
  );
}
