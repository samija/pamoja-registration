export interface ConferenceConfig {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface ConferencePricing {
  conferenceId: string;
  countrySlug: string;
  priceLocal: number;
  currency: string;
}

export const conferences: ConferenceConfig[] = [
  {
    id: "pamoja-v",
    name: "Pamoja Africa V",
    year: 2028,
    startDate: "2028-07-15",
    endDate: "2028-07-21",
    location: "Addis Ababa, Ethiopia",
    description:
      "The 5th Pan-African gathering of students, young professionals, and church leaders.",
  },
  {
    id: "staff-conference",
    name: "Staff Conference",
    year: 2028,
    startDate: "2028-07-12",
    endDate: "2028-07-14",
    location: "Addis Ababa, Ethiopia",
    description:
      "Pre-conference gathering for CCC Africa staff — renewal, vision-casting, and alignment.",
  },
];

export const pricing: ConferencePricing[] = [
  { conferenceId: "pamoja-v", countrySlug: "ethiopia", priceLocal: 9000, currency: "ETB" },
  { conferenceId: "staff-conference", countrySlug: "ethiopia", priceLocal: 6000, currency: "ETB" },
  { conferenceId: "pamoja-v", countrySlug: "kenya", priceLocal: 18000, currency: "KES" },
  { conferenceId: "staff-conference", countrySlug: "kenya", priceLocal: 12000, currency: "KES" },
  { conferenceId: "pamoja-v", countrySlug: "nigeria", priceLocal: 150000, currency: "NGN" },
  { conferenceId: "staff-conference", countrySlug: "nigeria", priceLocal: 100000, currency: "NGN" },
];

export function getPricingForCountry(countrySlug: string): ConferencePricing[] {
  return pricing.filter((p) => p.countrySlug === countrySlug);
}

export function getConference(id: string): ConferenceConfig | undefined {
  return conferences.find((c) => c.id === id);
}
