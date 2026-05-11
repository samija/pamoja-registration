"use client";

import { useState } from "react";
import { faq } from "@/config/content";

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">FAQ</h1>
        <p className="text-pamoja-charcoal-light">
          Common questions about Pamoja Africa V. Can&apos;t find your answer? Email us at info@runpamoja.org
        </p>
      </div>

      <div className="space-y-3">
        {faq.map((item, i) => (
          <div key={i} className="border border-pamoja-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 hover:bg-pamoja-cream/50 transition-colors"
            >
              <span className="font-medium text-pamoja-charcoal">{item.q}</span>
              <svg
                className={`w-5 h-5 text-pamoja-muted flex-shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIdx === i && (
              <div className="px-6 pb-4">
                <p className="text-pamoja-charcoal-light leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
