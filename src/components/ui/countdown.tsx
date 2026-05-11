"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2027-12-27T09:00:00+03:00").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calc(): TimeLeft {
  const diff = Math.max(TARGET - Date.now(), 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 sm:px-5 sm:py-3 min-w-[60px]">
        <p className="text-2xl sm:text-4xl font-bold text-white tabular-nums">
          {String(value).padStart(2, "0")}
        </p>
      </div>
      <p className="text-[10px] sm:text-xs text-white/50 mt-1.5 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export function Countdown() {
  const [time, setTime] = useState<TimeLeft>(calc());

  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex gap-2 sm:gap-4">
      <Digit value={time.days} label="Days" />
      <span className="text-2xl sm:text-4xl text-white/30 font-light self-start mt-2 sm:mt-3">:</span>
      <Digit value={time.hours} label="Hours" />
      <span className="text-2xl sm:text-4xl text-white/30 font-light self-start mt-2 sm:mt-3">:</span>
      <Digit value={time.minutes} label="Min" />
      <span className="text-2xl sm:text-4xl text-white/30 font-light self-start mt-2 sm:mt-3">:</span>
      <Digit value={time.seconds} label="Sec" />
    </div>
  );
}
