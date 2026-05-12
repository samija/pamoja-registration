import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { validatePromo, applyDiscount } from "@/lib/pricing";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const price = parseFloat(req.nextUrl.searchParams.get("price") || "0");

  if (!code) {
    return NextResponse.json({ error: "Promo code required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const result = await validatePromo(supabase, code);

  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error });
  }

  const discountedPrice = price > 0 && result.discountType && result.discountValue
    ? applyDiscount(price, result.discountType, result.discountValue)
    : null;

  return NextResponse.json({
    valid: true,
    discountType: result.discountType,
    discountValue: result.discountValue,
    discountedPrice,
    savings: price > 0 && discountedPrice ? price - discountedPrice : null,
  });
}
