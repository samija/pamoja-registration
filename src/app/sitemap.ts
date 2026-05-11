import type { MetadataRoute } from "next";
import { getAllCountrySlugs } from "@/config/countries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://runpamoja.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const countries = getAllCountrySlugs();

  const staticPages = [
    { url: BASE_URL, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/speakers`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/agenda`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/venue`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/directory`, changeFrequency: "daily" as const, priority: 0.7 },
  ];

  const countryPages = countries.flatMap((slug) => [
    { url: `${BASE_URL}/${slug}`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/${slug}/register`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/${slug}/register/group`, changeFrequency: "weekly" as const, priority: 0.8 },
  ]);

  return [...staticPages, ...countryPages].map((page) => ({
    ...page,
    lastModified: new Date(),
  }));
}
