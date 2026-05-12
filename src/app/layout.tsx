import type { Metadata } from "next";
import { Montserrat, Inter, Fraunces } from "next/font/google";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { BackToTop } from "@/components/ui/back-to-top";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pamoja Africa V — Continental Conference 2028",
    template: "%s | Pamoja Africa V",
  },
  description:
    "Join 5,000+ African students, young professionals, and church leaders in Addis Ababa for the 5th Pan-African gathering.",
  keywords: ["Pamoja", "Africa", "conference", "CCC", "Cru", "Addis Ababa", "2028", "registration"],
  openGraph: {
    title: "Pamoja Africa V — Arise, Shine. Africa Together.",
    description: "5,000+ delegates from across Africa. Dec 27, 2027 — Jan 6, 2028. Addis Ababa, Ethiopia.",
    url: "https://runpamoja.org",
    siteName: "Pamoja Africa V",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pamoja Africa V — Continental Conference 2028",
    description: "Join 5,000+ African leaders in Addis Ababa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
