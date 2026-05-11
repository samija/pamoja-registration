import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export const metadata = {
  title: "Accommodation — Pamoja Africa V",
  description: "Partner hotels near the Addis Ababa Convention Center for Pamoja Africa V delegates.",
};

const hotels = [
  {
    name: "Skylight Hotel",
    stars: 5,
    distance: "0.5 km from venue",
    pricePerNight: "$95",
    features: ["Breakfast included", "Airport shuttle", "Pool & spa", "Conference rate"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Premium",
  },
  {
    name: "Capital Hotel & Spa",
    stars: 4,
    distance: "1.2 km from venue",
    pricePerNight: "$68",
    features: ["Breakfast included", "Free Wi-Fi", "Restaurant", "Conference rate"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Standard",
  },
  {
    name: "Monarch Hotel",
    stars: 4,
    distance: "0.8 km from venue",
    pricePerNight: "$72",
    features: ["Breakfast included", "Gym", "Business center", "Conference rate"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Standard",
  },
  {
    name: "Zola International Hotel",
    stars: 3,
    distance: "1.5 km from venue",
    pricePerNight: "$48",
    features: ["Free Wi-Fi", "Restaurant", "24h reception"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Budget",
  },
  {
    name: "Bole Ambassador Hotel",
    stars: 3,
    distance: "2.0 km from venue",
    pricePerNight: "$42",
    features: ["Free Wi-Fi", "Airport proximity", "Restaurant"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Budget",
  },
  {
    name: "Shared Group Housing",
    stars: 0,
    distance: "Venue campus",
    pricePerNight: "$22",
    features: ["Shared rooms (4-6)", "Meals included", "On-site", "Groups only"],
    mapUrl: "#",
    bookUrl: "#",
    tier: "Group",
  },
];

const tierColors: Record<string, string> = {
  Premium: "bg-pamoja-orange/10 text-pamoja-orange",
  Standard: "bg-pamoja-lime/10 text-pamoja-green-mid",
  Budget: "bg-blue-50 text-blue-600",
  Group: "bg-purple-50 text-purple-600",
};

export default function AccommodationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-2">Stay</p>
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">Accommodation</h1>
        <p className="text-pamoja-charcoal-light max-w-xl mx-auto">
          Official partner hotels near the Addis Ababa Convention Center. All rates are conference-negotiated and include taxes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((h, i) => (
          <ScrollReveal key={h.name} delay={i * 80}>
            <Card variant="elevated" className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <CardTitle className="text-lg">{h.name}</CardTitle>
                  {h.stars > 0 && (
                    <p className="text-pamoja-orange text-xs mt-0.5">
                      {"★".repeat(h.stars)}{"☆".repeat(5 - h.stars)}
                    </p>
                  )}
                </div>
                <Badge className={tierColors[h.tier]}>{h.tier}</Badge>
              </div>
              <p className="text-sm text-pamoja-muted mb-3">{h.distance}</p>
              <CardContent className="flex-1">
                <ul className="space-y-1.5 mb-4">
                  {h.features.map((f) => (
                    <li key={f} className="text-sm text-pamoja-charcoal-light flex items-center gap-2">
                      <span className="text-pamoja-lime text-xs">&#10003;</span> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="flex items-end justify-between pt-4 border-t border-pamoja-border mt-auto">
                <div>
                  <p className="text-2xl font-bold text-pamoja-charcoal">{h.pricePerNight}</p>
                  <p className="text-xs text-pamoja-muted">per night</p>
                </div>
                <Button size="sm" variant="outline">Reserve</Button>
              </div>
            </Card>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card variant="glass" className="inline-block max-w-lg">
          <p className="text-pamoja-charcoal-light text-sm">
            Accommodation is booked separately from registration. Group leaders registering 10+ delegates can request block bookings at further discounted rates.
          </p>
          <Link href="/faq" className="text-pamoja-green-mid text-sm hover:underline mt-3 inline-block">
            See FAQ for visa & travel info →
          </Link>
        </Card>
      </div>
    </div>
  );
}
