import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-pamoja-green-deep text-white/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <span className="text-pamoja-lime font-bold text-lg">PAMOJA</span>
            <p className="mt-2 text-sm leading-relaxed">
              Uniting Africa&apos;s next generation of leaders through faith, fellowship, and purpose.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/#about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/#conferences" className="block hover:text-white transition-colors">Conferences</Link>
              <Link href="/ethiopia/register" className="block hover:text-white transition-colors">Register</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
              <p>info@runpamoja.org</p>
              <p>Addis Ababa, Ethiopia</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} Pamoja Africa. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
