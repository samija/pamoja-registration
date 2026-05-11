import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const VALID_COUNTRIES = ["ethiopia", "kenya", "nigeria"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Country route validation
  const countryMatch = pathname.match(/^\/([^/]+)/);
  if (countryMatch) {
    const slug = countryMatch[1];
    if (!["admin", "api", "_next", "favicon.ico"].includes(slug)) {
      if (!VALID_COUNTRIES.includes(slug)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  // Admin auth protection (skip login page)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const res = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/).*)",
  ],
};
