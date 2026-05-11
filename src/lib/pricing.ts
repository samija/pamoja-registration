import { SupabaseClient } from "@supabase/supabase-js";

export interface PricingTier {
  id: string;
  name: string;
  label: string;
  price_local: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface PromoResult {
  valid: boolean;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  promoCodeId?: string;
  error?: string;
}

/** Get the active pricing tier for a country-conference */
export async function getActiveTier(
  supabase: SupabaseClient,
  countryId: string,
  conferenceId: string
): Promise<PricingTier | null> {
  const now = new Date().toISOString();

  const { data: cc } = await supabase
    .from("country_conferences")
    .select("id")
    .eq("country_id", countryId)
    .eq("conference_id", conferenceId)
    .single();

  if (!cc) return null;

  const { data: tier } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("country_conference_id", cc.id)
    .eq("is_active", true)
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("starts_at", { ascending: false })
    .limit(1)
    .single();

  return tier as PricingTier | null;
}

/** Validate and apply a promo code */
export async function validatePromo(
  supabase: SupabaseClient,
  code: string,
  countryId?: string,
  conferenceId?: string
): Promise<PromoResult> {
  const { data: promo } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!promo) return { valid: false, error: "Invalid promo code" };

  const now = new Date();
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    return { valid: false, error: "Promo code has expired" };
  }
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    return { valid: false, error: "Promo code is not yet active" };
  }
  if (promo.max_uses && promo.used_count >= promo.max_uses) {
    return { valid: false, error: "Promo code usage limit reached" };
  }
  if (promo.country_id && promo.country_id !== countryId) {
    return { valid: false, error: "Promo code not valid for this country" };
  }
  if (promo.conference_id && promo.conference_id !== conferenceId) {
    return { valid: false, error: "Promo code not valid for this conference" };
  }

  return {
    valid: true,
    discountType: promo.discount_type,
    discountValue: promo.discount_value,
    promoCodeId: promo.id,
  };
}

export function applyDiscount(price: number, discountType: string, discountValue: number): number {
  if (discountType === "percentage") {
    return Math.round(price * (1 - discountValue / 100));
  }
  return Math.max(price - discountValue, 0);
}
