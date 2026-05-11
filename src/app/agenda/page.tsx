"use client";

import { useState } from "react";
import { agenda } from "@/config/content";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const typeColor: Record<string, string> = {
  Plenary: "bg-pamoja-lime/20 text-pamoja-green-mid",
  Workshop: "bg-blue-100 text-blue-700",
  Worship: "bg-purple-100 text-purple-700",
  Fellowship: "bg-pamoja-orange/20 text-pamoja-orange",
  Discussion: "bg-yellow-100 text-yellow-700",
  Panel: "bg-cyan-100 text-cyan-700",
  Logistics: "bg-gray-100 text-gray-600",
  Cultural: "bg-pink-100 text-pink-700",
  Mission: "bg-emerald-100 text-emerald-700",
  Track: "bg-indigo-100 text-indigo-700",
  Family: "bg-rose-100 text-rose-600",
};

export default function AgendaPage() {
  const [confKey, setConfKey] = useState<"pamoja" | "staff">("pamoja");
  const conf = agenda[confKey];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <p className="text-pamoja-lime text-sm font-semibold tracking-widest uppercase mb-2">Full Programme</p>
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">Agenda</h1>
      </div>

      {/* Conference tabs */}
      <div className="flex justify-center gap-3 mb-10">
        {Object.entries(agenda).map(([key, c]) => (
          <button
            key={key}
            onClick={() => setConfKey(key as "pamoja" | "staff")}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              confKey === key
                ? "text-white"
                : "bg-white text-pamoja-charcoal-light border border-pamoja-border hover:bg-pamoja-cream"
            }`}
            style={confKey === key ? { background: c.color } : undefined}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-center text-pamoja-charcoal-light text-sm mb-8">{conf.sub}</p>

      {/* Days */}
      <div className="space-y-8">
        {conf.days.map((day) => (
          <Card key={day.date} variant="elevated" className="overflow-hidden p-0">
            <div className="px-6 py-4 border-b border-pamoja-border" style={{ borderLeftColor: conf.color, borderLeftWidth: 4 }}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-pamoja-muted">{day.label}</span>
                  <h3 className="text-lg font-bold text-pamoja-charcoal">{day.tagline}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-pamoja-charcoal">{day.date}</p>
                  <p className="text-xs text-pamoja-muted">{day.weekday}</p>
                </div>
              </div>
            </div>
            <div className="divide-y divide-pamoja-border/50">
              {day.sessions.map((s, i) => (
                <div key={i} className="px-6 py-3 flex items-start gap-4 hover:bg-pamoja-cream/30 transition-colors">
                  <span className="text-xs text-pamoja-muted font-mono w-28 flex-shrink-0 pt-0.5">{s.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-pamoja-charcoal">{s.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-pamoja-muted">{s.venue}</span>
                      {s.speaker && (
                        <span className="text-xs text-pamoja-green-mid">— {s.speaker}</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${typeColor[s.type] || "bg-gray-100 text-gray-600"}`}>
                    {s.type}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
