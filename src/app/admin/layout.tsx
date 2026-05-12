"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/admin/registrants", label: "Registrants", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/admin/groups", label: "Groups", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { href: "/admin/checkin", label: "Check-In", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
  { href: "/admin/verification", label: "Verification", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { href: "/admin/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { href: "/admin/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" },
  { href: "/admin/email", label: "Email Blast", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/admin/promos", label: "Promo Codes", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" },
  { href: "/admin/import", label: "Import CSV", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
  { href: "/admin/audit", label: "Audit Log", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
];

function NavIcon({ d }: { d: string }) {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="min-h-screen bg-pamoja-cream">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-56 flex-col bg-pamoja-green-deep min-h-screen fixed">
          <div className="px-5 py-6">
            <Link href="/admin" className="text-pamoja-lime font-bold text-lg">PAMOJA</Link>
            <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
          </div>
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "bg-pamoja-lime/10 text-pamoja-lime font-medium"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <NavIcon d={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="px-3 pb-6">
            <form action="/api/admin/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <NavIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                Sign Out
              </button>
            </form>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 lg:ml-56">
          {/* Mobile header */}
          <div className="lg:hidden bg-pamoja-green-deep px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <Link href="/admin" className="text-pamoja-lime font-bold">PAMOJA Admin</Link>
              <form action="/api/admin/logout" method="POST">
                <button type="submit" className="text-white/40 text-xs hover:text-white">Sign Out</button>
              </form>
            </div>
            <div className="flex gap-2 flex-wrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs px-2 py-1 rounded transition-colors ${
                    isActive(item.href)
                      ? "bg-pamoja-lime/20 text-pamoja-lime font-medium"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
