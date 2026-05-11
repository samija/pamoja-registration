import Link from "next/link";
import Image from "next/image";
import { countries } from "@/config/countries";
import { conferences } from "@/config/conferences";
import { history } from "@/config/content";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/ui/countdown";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

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
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/ethiopia/register">
                <Button size="lg">Register Now</Button>
              </Link>
              <Link href="#conferences">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  View Conferences
                </Button>
              </Link>
            </div>
            <Countdown />
          </div>
        </div>
      </section>

      {/* About */}
      <ScrollReveal>
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
      </ScrollReveal>

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

      {/* Testimonials */}
      <ScrollReveal>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-pamoja-charcoal mb-10 text-center">
          Voices from Pamoja
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Grace Wanjiru", role: "Delegate, Pamoja IV", country: "Kenya", quote: "I came as a first-year student. I left with a continent in my heart.", photo: "/assets/past_1.png" },
            { name: "Pst. Ezekiel Banda", role: "Delegate, Pamoja III", country: "Zambia", quote: "Pamoja is where a generation of African leaders learned to pray together, fail together, and believe for something bigger than themselves.", photo: "/assets/past_2.png" },
            { name: "Hannah Tesfaye", role: "Young Professional, Pamoja IV", country: "Ethiopia", quote: "Hosting Pamoja V at home feels like ten years of prayer finally arriving at our door.", photo: "/assets/speaker4.png" },
          ].map((t) => (
            <Card key={t.name} variant="glass" className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Image src={t.photo} alt={t.name} width={44} height={44} className="w-11 h-11 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-pamoja-charcoal text-sm">{t.name}</p>
                  <p className="text-xs text-pamoja-muted">{t.role} — {t.country}</p>
                </div>
              </div>
              <p className="text-pamoja-charcoal-light text-sm leading-relaxed italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
            </Card>
          ))}
        </div>
      </section>
      </ScrollReveal>

      {/* History */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pamoja-charcoal mb-10 text-center">Our Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {history.map((h) => (
              <div key={h.year} className={`relative rounded-xl overflow-hidden group ${h.upcoming ? "ring-2 ring-pamoja-lime" : ""}`}>
                <div className="aspect-[3/4] relative">
                  <Image src={h.image} alt={h.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 p-4">
                  <p className="text-pamoja-lime text-xs font-semibold">{h.year}</p>
                  <p className="text-white font-bold">{h.label}</p>
                  <p className="text-white/60 text-xs mt-1">{h.place} — {h.delegates} delegates</p>
                </div>
              </div>
            ))}
          </div>
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
