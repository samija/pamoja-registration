"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const navLinks = [
  { href: "/speakers", label: "Speakers" },
  { href: "/agenda", label: "Agenda" },
  { href: "/venue", label: "Venue" },
  { href: "/gallery", label: "Gallery" },
  { href: "/directory", label: "Directory" },
  { href: "/contact", label: "Contact" },
  { href: "/my-registration", label: "My Registration" },
];

const mobileLinks = [
  ...navLinks,
  { href: "/accommodation", label: "Accommodation" },
  { href: "/faq", label: "FAQ" },
  { href: "/status", label: "Check Status" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href;
  }

  return (
    <nav className="sticky top-0 z-50 bg-pamoja-green-deep/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="text-pamoja-lime font-bold text-xl tracking-tight">
              PAMOJA
            </span>
            <span className="hidden sm:block text-white/60 text-sm font-light">
              Africa V
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive(link.href)
                    ? "text-pamoja-lime font-medium"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ethiopia/register"
              className="bg-pamoja-lime text-pamoja-green-deep px-5 py-2 rounded-lg text-sm font-semibold hover:bg-pamoja-lime/90 transition-colors"
            >
              Register
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden pb-4 space-y-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block text-sm py-2 px-2 rounded transition-colors ${
                  isActive(link.href)
                    ? "text-pamoja-lime bg-pamoja-lime/10 font-medium"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/ethiopia/register"
              onClick={() => setOpen(false)}
              className="block bg-pamoja-lime text-pamoja-green-deep px-5 py-2.5 rounded-lg text-sm font-semibold text-center mt-3"
            >
              Register Now
            </Link>
            <div className="pt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
