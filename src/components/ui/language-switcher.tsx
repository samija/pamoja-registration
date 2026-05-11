"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function LanguageSwitcher({ locales }: { locales: string[] }) {
  const [locale, setLocale] = useState("en");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("pamoja-locale");
    if (stored && locales.includes(stored)) setLocale(stored);
  }, [locales]);

  function switchLocale(newLocale: string) {
    setLocale(newLocale);
    localStorage.setItem("pamoja-locale", newLocale);
    router.refresh();
  }

  if (locales.length <= 1) return null;

  return (
    <div className="flex gap-1 bg-white/10 rounded-lg p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
            locale === l
              ? "bg-pamoja-lime text-pamoja-green-deep font-semibold"
              : "text-white/60 hover:text-white"
          }`}
        >
          {l === "am" ? "አማ" : l === "sw" ? "SW" : "EN"}
        </button>
      ))}
    </div>
  );
}

/** Hook to get current locale from localStorage */
export function useLocale(): string {
  const [locale, setLocale] = useState("en");
  useEffect(() => {
    setLocale(localStorage.getItem("pamoja-locale") || "en");
    const handler = () => setLocale(localStorage.getItem("pamoja-locale") || "en");
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);
  return locale;
}
