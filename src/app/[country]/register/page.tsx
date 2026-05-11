import { notFound } from "next/navigation";
import { getCountryConfig } from "@/config/countries";
import { getPricingForCountry } from "@/config/conferences";
import { RegistrationForm } from "@/components/registration/registration-form";

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ conference?: string }>;
}) {
  const { country } = await params;
  const { conference } = await searchParams;
  const config = getCountryConfig(country);
  if (!config) notFound();

  const pricing = getPricingForCountry(country);

  return (
    <div className="bg-pamoja-cream min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-4xl mb-2">{config.flag}</p>
          <h1 className="text-3xl font-bold text-pamoja-charcoal mb-2">
            Registration
          </h1>
          <p className="text-pamoja-charcoal-light">
            {config.name} Office &middot; Pay in {config.currencySymbol} {config.currency}
          </p>
        </div>

        <RegistrationForm
          countrySlug={country}
          countryConfig={config}
          pricing={pricing}
          defaultConference={conference}
        />
      </div>
    </div>
  );
}
