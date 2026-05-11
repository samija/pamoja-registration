import Image from "next/image";
import { venueInfo } from "@/config/content";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Venue — Pamoja Africa V",
  description: "Addis Ababa Convention Center — the home of Pamoja Africa V 2028.",
};

export default function VenuePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <Image
          src="/assets/venue_hero.jpg"
          alt="Addis Ababa Convention Center"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pamoja-green-deep/90 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-2">Venue</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{venueInfo.name}</h1>
          <p className="text-white/60 mt-2">{venueInfo.tagline}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About */}
        <div className="max-w-3xl mb-16">
          <p className="text-pamoja-charcoal-light leading-relaxed text-lg">{venueInfo.body}</p>
          <p className="text-sm text-pamoja-muted mt-4">{venueInfo.address}</p>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {venueInfo.specs.map((s) => (
            <Card key={s.label} variant="elevated" className="text-center">
              <CardContent>
                <p className="text-3xl font-bold text-pamoja-charcoal">{s.value}</p>
                <p className="text-sm text-pamoja-muted mt-1">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-pamoja-charcoal mb-6">Facilities</h2>
            <ul className="space-y-3">
              {venueInfo.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="text-pamoja-lime mt-1 flex-shrink-0">&#10003;</span>
                  <span className="text-pamoja-charcoal-light">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-pamoja-charcoal mb-6">Getting There</h2>
            <div className="space-y-6">
              {venueInfo.logistics.map((l) => (
                <div key={l.title}>
                  <h3 className="font-semibold text-pamoja-charcoal">{l.title}</h3>
                  <p className="text-sm text-pamoja-charcoal-light mt-1">{l.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
