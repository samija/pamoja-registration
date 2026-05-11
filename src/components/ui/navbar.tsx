"use client";

import Link from "next/link";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

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
          <div className="hidden md:flex items-center gap-6">
            <Link href="/speakers" className="text-white/70 hover:text-white text-sm transition-colors">
              Speakers
            </Link>
            <Link href="/agenda" className="text-white/70 hover:text-white text-sm transition-colors">
              Agenda
            </Link>
            <Link href="/venue" className="text-white/70 hover:text-white text-sm transition-colors">
              Venue
            </Link>
            <Link href="/directory" className="text-white/70 hover:text-white text-sm transition-colors">
              Directory
            </Link>
            <Link href="/faq" className="text-white/70 hover:text-white text-sm transition-colors">
              FAQ
            </Link>
            <Link
              href="/ethiopia/register"
              className="bg-pamoja-lime text-pamoja-green-deep px-5 py-2 rounded-lg text-sm font-semibold hover:bg-pamoja-lime/90 transition-colors"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2"
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
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/#about" onClick={() => setOpen(false)} className="block text-white/70 hover:text-white text-sm py-2">
              About
            </Link>
            <Link href="/#conferences" onClick={() => setOpen(false)} className="block text-white/70 hover:text-white text-sm py-2">
              Conferences
            </Link>
            <Link href="/#countries" onClick={() => setOpen(false)} className="block text-white/70 hover:text-white text-sm py-2">
              Countries
            </Link>
            <Link href="/directory" onClick={() => setOpen(false)} className="block text-white/70 hover:text-white text-sm py-2">
              Directory
            </Link>
            <Link
              href="/ethiopia/register"
              onClick={() => setOpen(false)}
              className="block bg-pamoja-lime text-pamoja-green-deep px-5 py-2.5 rounded-lg text-sm font-semibold text-center mt-2"
            >
              Register Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
