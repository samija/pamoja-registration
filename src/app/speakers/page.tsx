import Image from "next/image";
import { speakers } from "@/config/content";
import { Card } from "@/components/ui/card";

export const metadata = {
  title: "Speakers — Pamoja Africa V",
  description: "Meet the speakers of Pamoja Africa V 2028 in Addis Ababa.",
};

export default function SpeakersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-2">Pamoja Africa V</p>
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">Speakers</h1>
        <p className="text-pamoja-charcoal-light max-w-xl mx-auto">
          Leaders, pastors, and thought-shapers from across the continent. More speakers to be announced.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((s) => (
          <Card key={s.name} className="overflow-hidden p-0">
            <div
              className="h-48 flex items-end justify-center relative"
              style={{ background: s.bg }}
            >
              {s.photo ? (
                <Image
                  src={s.photo}
                  alt={s.name}
                  width={160}
                  height={160}
                  className="object-contain relative z-10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center mb-6" style={{ borderColor: s.fg, color: s.fg }}>
                  <span className="text-sm">TBA</span>
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-bold text-pamoja-charcoal text-lg">{s.name}</h3>
              <p className="text-sm text-pamoja-charcoal-light mt-1">{s.role}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-pamoja-muted">{s.country}</span>
                <span className="text-xs bg-pamoja-cream px-2 py-1 rounded-full text-pamoja-charcoal-light">{s.date}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
