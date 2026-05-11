import { notFound } from "next/navigation";
import { getCountryConfig, getAllCountrySlugs } from "@/config/countries";

export function generateStaticParams() {
  return getAllCountrySlugs().map((slug) => ({ country: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const config = getCountryConfig(country);
  if (!config) return {};
  return {
    title: `Pamoja Africa V — ${config.name} ${config.flag}`,
    description: `Register for Pamoja Africa V through the ${config.name} National Office. Pay in ${config.currency}.`,
  };
}

export default async function CountryLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const config = getCountryConfig(country);
  if (!config) notFound();

  return <>{children}</>;
}
