import { notFound } from "next/navigation";
import { getCountryConfig } from "@/config/countries";
import { getPricingForCountry } from "@/config/conferences";
import { GroupRegistrationForm } from "@/components/registration/group-registration-form";

export default async function GroupRegisterPage({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country } = await params;
  const config = getCountryConfig(country);
  if (!config) notFound();

  const pricing = getPricingForCountry(country);

  return (
    <div className="bg-pamoja-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="text-4xl mb-2">{config.flag}</p>
          <h1 className="text-3xl font-bold text-pamoja-charcoal mb-2">
            Group Registration
          </h1>
          <p className="text-pamoja-charcoal-light">
            Register your church or campus delegation &middot; {config.name} Office
          </p>
        </div>

        <GroupRegistrationForm
          countrySlug={country}
          countryConfig={config}
          pricing={pricing}
        />
      </div>
    </div>
  );
}
