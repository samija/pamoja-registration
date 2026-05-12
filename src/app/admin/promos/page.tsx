"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showToast, ToastContainer } from "@/components/ui/toast";

interface PromoCode {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
}

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validUntil, setValidUntil] = useState("");

  async function load() {
    const supabase = createClient();
    const { data } = await supabase
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });
    setPromos((data as PromoCode[]) || []);
  }

  useEffect(() => { load(); }, []);

  async function createPromo() {
    if (!newCode || !discountValue) return;
    const supabase = createClient();
    const { error } = await supabase.from("promo_codes").insert({
      code: newCode.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      max_uses: maxUses ? parseInt(maxUses) : null,
      valid_until: validUntil || null,
    });

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Promo code created", "success");
      setShowForm(false);
      setNewCode(""); setDiscountValue(""); setMaxUses(""); setValidUntil("");
      load();
    }
  }

  async function togglePromo(id: string, active: boolean) {
    const supabase = createClient();
    await supabase.from("promo_codes").update({ is_active: active }).eq("id", id);
    showToast(active ? "Code enabled" : "Code disabled", "info");
    load();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-pamoja-charcoal">Promo Codes</h1>
          <p className="text-pamoja-charcoal-light text-sm mt-1">{promos.length} codes</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ New Code"}
        </Button>
      </div>

      <ToastContainer />

      {/* Create form */}
      {showForm && (
        <Card variant="elevated" className="mb-6 space-y-4">
          <h3 className="font-semibold text-pamoja-charcoal">Create Promo Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Code" value={newCode} onChange={(e) => setNewCode(e.target.value.toUpperCase())} placeholder="e.g. ARISE2028" />
            <Select
              label="Discount Type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
              options={[
                { value: "percentage", label: "Percentage (%)" },
                { value: "fixed", label: "Fixed Amount" },
              ]}
            />
            <Input label={discountType === "percentage" ? "Discount (%)" : "Discount Amount"} type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder={discountType === "percentage" ? "e.g. 15" : "e.g. 3000"} />
            <Input label="Max Uses (optional)" type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value)} placeholder="Leave empty for unlimited" />
            <Input label="Valid Until (optional)" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
          <Button onClick={createPromo}>Create Code</Button>
        </Card>
      )}

      {/* Promo list */}
      <Card variant="elevated" className="overflow-hidden p-0">
        {promos.length === 0 ? (
          <p className="p-8 text-center text-pamoja-muted">No promo codes yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-pamoja-cream/50 border-b border-pamoja-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Code</th>
                  <th className="text-left px-4 py-3 font-medium">Discount</th>
                  <th className="text-left px-4 py-3 font-medium">Usage</th>
                  <th className="text-left px-4 py-3 font-medium">Expires</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pamoja-border">
                {promos.map((p) => {
                  const expired = p.valid_until && new Date(p.valid_until) < new Date();
                  const exhausted = p.max_uses && p.used_count >= p.max_uses;
                  return (
                    <tr key={p.id} className={!p.is_active ? "opacity-50" : ""}>
                      <td className="px-4 py-3 font-mono font-bold tracking-wider">{p.code}</td>
                      <td className="px-4 py-3">
                        {p.discount_type === "percentage"
                          ? `${p.discount_value}% off`
                          : `${p.discount_value.toLocaleString()} off`}
                      </td>
                      <td className="px-4 py-3">
                        {p.used_count}{p.max_uses ? ` / ${p.max_uses}` : ""}
                        {exhausted && <Badge variant="error" className="ml-2">Exhausted</Badge>}
                      </td>
                      <td className="px-4 py-3 text-pamoja-muted">
                        {p.valid_until ? new Date(p.valid_until).toLocaleDateString() : "Never"}
                        {expired && <Badge variant="error" className="ml-2">Expired</Badge>}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={p.is_active ? "success" : "default"}>
                          {p.is_active ? "Active" : "Disabled"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePromo(p.id, !p.is_active)}
                        >
                          {p.is_active ? "Disable" : "Enable"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
