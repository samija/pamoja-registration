export interface CountryConfig {
  slug: string;
  name: string;
  nameLocal: string;
  currency: string;
  currencySymbol: string;
  locale: string;
  locales: string[];
  paymentGateway: "chapa" | "mpesa" | "paystack";
  timezone: string;
  flag: string;
  contactEmail: string;
  contactPhone: string;
}

export const countries: Record<string, CountryConfig> = {
  ethiopia: {
    slug: "ethiopia",
    name: "Ethiopia",
    nameLocal: "ኢትዮጵያ",
    currency: "ETB",
    currencySymbol: "Br",
    locale: "am-ET",
    locales: ["am", "en"],
    paymentGateway: "chapa",
    timezone: "Africa/Addis_Ababa",
    flag: "🇪🇹",
    contactEmail: "ethiopia@runpamoja.org",
    contactPhone: "+251911000000",
  },
  kenya: {
    slug: "kenya",
    name: "Kenya",
    nameLocal: "Kenya",
    currency: "KES",
    currencySymbol: "KSh",
    locale: "en-KE",
    locales: ["en", "sw"],
    paymentGateway: "mpesa",
    timezone: "Africa/Nairobi",
    flag: "🇰🇪",
    contactEmail: "kenya@runpamoja.org",
    contactPhone: "+254700000000",
  },
  nigeria: {
    slug: "nigeria",
    name: "Nigeria",
    nameLocal: "Nigeria",
    currency: "NGN",
    currencySymbol: "₦",
    locale: "en-NG",
    locales: ["en"],
    paymentGateway: "paystack",
    timezone: "Africa/Lagos",
    flag: "🇳🇬",
    contactEmail: "nigeria@runpamoja.org",
    contactPhone: "+2348000000000",
  },
};

export function getCountryConfig(slug: string): CountryConfig | undefined {
  return countries[slug];
}

export function getAllCountrySlugs(): string[] {
  return Object.keys(countries);
}
