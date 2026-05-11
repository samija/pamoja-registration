/** Exchange rate service — fetches spot rate and caches for 1 hour */

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface RateCache {
  rates: Record<string, number>;
  fetchedAt: number;
}

let cache: RateCache | null = null;

async function fetchRates(): Promise<Record<string, number>> {
  const res = await fetch(
    "https://open.er-api.com/v6/latest/USD"
  );
  const data = await res.json();
  if (data.result !== "success") {
    throw new Error("Failed to fetch exchange rates");
  }
  return data.rates;
}

export async function getExchangeRate(currency: string): Promise<number> {
  if (currency === "USD") return 1;

  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    const rate = cache.rates[currency];
    if (rate) return rate;
  }

  const rates = await fetchRates();
  cache = { rates, fetchedAt: now };

  const rate = rates[currency];
  if (!rate) throw new Error(`No exchange rate found for ${currency}`);
  return rate;
}

export function convertToUsd(amountLocal: number, exchangeRate: number): number {
  return Math.round((amountLocal / exchangeRate) * 100) / 100;
}
