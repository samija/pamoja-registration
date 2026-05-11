import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-pamoja-lime mb-4">404</p>
        <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Page Not Found</h1>
        <p className="text-pamoja-charcoal-light mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
