"use client";

import { useState } from "react";
import Image from "next/image";
import { history } from "@/config/content";

const galleryImages = [
  { src: "/assets/past_1.png", event: "Pamoja I", year: "2006", caption: "Students gathering in Nakuru, Kenya" },
  { src: "/assets/past_2.png", event: "Pamoja II", year: "2009", caption: "Worship in Yamoussoukro, Cote d'Ivoire" },
  { src: "/assets/past_3.png", event: "Pamoja III", year: "2013", caption: "Delegates in Lagos, Nigeria" },
  { src: "/assets/conference_crowd.jpg", event: "Pamoja IV", year: "2016", caption: "34 nations gathered in Lusaka, Zambia" },
  { src: "/assets/venue_hero.jpg", event: "Pamoja V", year: "2028", caption: "Addis Ababa Convention Center — the next chapter" },
  { src: "/assets/arise_01.jpg", event: "Arise Africa", year: "", caption: "The spirit of Pamoja" },
  { src: "/assets/arise_02.jpg", event: "Arise Africa", year: "", caption: "Worship and fellowship" },
  { src: "/assets/arise_03.jpg", event: "Arise Africa", year: "", caption: "Continental unity" },
  { src: "/assets/arise_04.jpg", event: "Arise Africa", year: "", caption: "A new generation rising" },
  { src: "/assets/theme_photo.jpg", event: "Theme", year: "", caption: "Arise, Shine — Africa Together" },
];

export default function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-2">Memories</p>
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">Photo Gallery</h1>
        <p className="text-pamoja-charcoal-light max-w-xl mx-auto">
          Moments from Pamoja gatherings across the continent — 2006 to present.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex gap-3 justify-center mb-10 flex-wrap">
        {history.map((h) => (
          <div key={h.year} className={`text-center px-3 py-1.5 rounded-full text-xs font-medium ${h.upcoming ? "bg-pamoja-lime text-pamoja-green-deep" : "bg-pamoja-cream text-pamoja-charcoal-light border border-pamoja-border"}`}>
            {h.label} — {h.place}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {galleryImages.map((img, i) => (
          <div
            key={i}
            className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl"
            onClick={() => setSelected(i)}
          >
            <Image
              src={img.src}
              alt={img.caption}
              width={600}
              height={400}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 p-4">
                <p className="text-white text-sm font-semibold">{img.event} {img.year && `(${img.year})`}</p>
                <p className="text-white/70 text-xs">{img.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl"
            onClick={() => setSelected(null)}
          >
            &times;
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryImages[selected].src}
              alt={galleryImages[selected].caption}
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <p className="text-white font-semibold">{galleryImages[selected].event} {galleryImages[selected].year && `(${galleryImages[selected].year})`}</p>
              <p className="text-white/60 text-sm">{galleryImages[selected].caption}</p>
            </div>
          </div>
          {/* Nav arrows */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + galleryImages.length) % galleryImages.length); }}
          >
            &#8249;
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-4xl"
            onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % galleryImages.length); }}
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  );
}
