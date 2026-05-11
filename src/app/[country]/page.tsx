import { notFound } from "next/navigation";
import { getCountryConfig } from "@/config/countries";
import { getPricingForCountry, getConference } from "@/config/conferences";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const config = getCountryConfig(country);
  if (!config) notFound();

  const pricing = getPricingForCountry(country);

  return (
    <div>
      {/* Hero */}
      <section className="bg-pamoja-green-deep text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-6xl mb-4">{config.flag}</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pamoja Africa V
              <br />
              <span className="text-pamoja-lime">{config.name} Office</span>
            </h1>
            <p className="text-lg text-white/70 mb-2">
              {config.nameLocal !== config.name && (
                <span className="text-pamoja-lime">{config.nameLocal} &middot; </span>
              )}
              Pay in {config.currency} ({config.currencySymbol})
            </p>
            <p className="text-white/50 text-sm mb-8">
              {config.contactEmail}
            </p>
            <div className="flex flex-wrap gap-4">
              <ButtonLink href={`/${country}/register`} size="lg">
                Register Now
              </ButtonLink>
              <ButtonLink href={`/${country}/register/group`} size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Group Registration
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Conference Pricing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-pamoja-charcoal mb-10 text-center">
          Choose Your Conference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {pricing.map((p) => {
            const conf = getConference(p.conferenceId);
            if (!conf) return null;
            return (
              <Card key={p.conferenceId} variant="elevated" className="flex flex-col">
                <CardTitle className="text-xl">{conf.name}</CardTitle>
                <p className="text-sm text-pamoja-muted mb-4">
                  {conf.startDate} — {conf.endDate}
                </p>
                <CardContent className="flex-1">
                  <p className="text-pamoja-charcoal-light text-sm mb-6">
                    {conf.description}
                  </p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold text-pamoja-charcoal">
                      {config.currencySymbol}
                      {p.priceLocal.toLocaleString()}
                      <span className="text-sm font-normal text-pamoja-muted ml-1">
                        {p.currency}
                      </span>
                    </p>
                    <ButtonLink href={`/${country}/register?conference=${p.conferenceId}`} size="md">
                      Select
                    </ButtonLink>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-pamoja-charcoal mb-4">
            {config.name} National Office
          </h2>
          <p className="text-pamoja-charcoal-light mb-2">{config.contactEmail}</p>
          <p className="text-pamoja-charcoal-light">{config.contactPhone}</p>
        </div>
      </section>
    </div>
  );
}
