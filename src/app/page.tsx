import Link from "next/link";
import { countries } from "@/config/countries";
import { conferences } from "@/config/conferences";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-pamoja-green-deep text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pamoja-green-deep via-pamoja-green-dark to-pamoja-green-deep" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36">
          <div className="max-w-3xl">
            <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-4">
              July 2028 &middot; Addis Ababa
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
              Arise, Shine.
              <br />
              <span className="text-pamoja-lime">Africa Together.</span>
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl">
              5,000+ students, young professionals, and church leaders from across Africa gathering for worship, vision, and commissioning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/ethiopia/register">
                <Button size="lg">Register Now</Button>
              </Link>
              <Link href="#conferences">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  View Conferences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-pamoja-charcoal mb-4">
            What is Pamoja?
          </h2>
          <p className="text-pamoja-charcoal-light leading-relaxed">
            Pamoja — Swahili for &ldquo;together&rdquo; — is the continental gathering of Campus Crusade for Christ Africa. Since 2006, Pamoja has united thousands across 5 continents for worship, fellowship, and missional alignment. The 5th edition returns to Addis Ababa in 2028.
          </p>
        </div>
      </section>

      {/* Conferences */}
      <section id="conferences" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pamoja-charcoal mb-10 text-center">
            Conferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {conferences.map((conf) => (
              <Card key={conf.id} variant="elevated" className="flex flex-col">
                <CardTitle className="text-xl mb-1">{conf.name}</CardTitle>
                <p className="text-sm text-pamoja-muted mb-3">
                  {conf.startDate} — {conf.endDate} &middot; {conf.location}
                </p>
                <CardContent className="flex-1">
                  <p className="text-pamoja-charcoal-light text-sm leading-relaxed">
                    {conf.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section id="countries" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-pamoja-charcoal mb-4 text-center">
          National Offices
        </h2>
        <p className="text-center text-pamoja-charcoal-light mb-10 max-w-xl mx-auto">
          Register through your country office for localized pricing and payment options.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {Object.values(countries).map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer text-center">
                <p className="text-4xl mb-3">{c.flag}</p>
                <CardTitle>{c.name}</CardTitle>
                <p className="text-sm text-pamoja-muted">{c.nameLocal}</p>
                <p className="text-xs text-pamoja-muted mt-2">
                  Pay in {c.currency} via {c.paymentGateway === "chapa" ? "Telebirr / Bank" : c.paymentGateway === "mpesa" ? "M-Pesa" : "Paystack"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-pamoja-green-deep text-white py-20">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Arise?</h2>
          <p className="text-white/70 mb-8">
            Secure your spot at Pamoja Africa V. Early registration is now open.
          </p>
          <Link href="/ethiopia/register">
            <Button size="lg">Register Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
