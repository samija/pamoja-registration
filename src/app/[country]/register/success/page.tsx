import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryConfig } from "@/config/countries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<{ tx_ref?: string; waitlisted?: string; id?: string }>;
}) {
  const { country } = await params;
  const { tx_ref, waitlisted, id } = await searchParams;
  const config = getCountryConfig(country);
  if (!config) notFound();

  const isWaitlisted = waitlisted === "true";

  return (
    <div className="bg-pamoja-cream min-h-screen flex items-center justify-center px-4">
      <Card variant="elevated" className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">{isWaitlisted ? "⏳" : "✓"}</div>
        <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">
          {isWaitlisted ? "You're on the Waitlist" : "Registration Complete!"}
        </h1>
        <p className="text-pamoja-charcoal-light mb-6">
          {isWaitlisted
            ? "Registration is at capacity. We've added you to the waitlist and will notify you when a spot opens."
            : "Thank you for registering for Pamoja Africa V. You will receive a confirmation email shortly."}
        </p>
        {tx_ref && (
          <p className="text-xs text-pamoja-muted mb-4">
            Reference: {tx_ref}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {/* Calendar download for confirmed */}
          {!isWaitlisted && id && (
            <a href={`/api/calendar?id=${id}`} download>
              <Button variant="primary" className="w-full">
                Add to Calendar (.ics)
              </Button>
            </a>
          )}

          {/* Invitation letter for confirmed */}
          {!isWaitlisted && id && (
            <a href={`/api/invitation?id=${id}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full">
                Download Invitation Letter
              </Button>
            </a>
          )}

          {/* Check status */}
          <Link href="/status">
            <Button variant="outline" className="w-full">
              Check Registration Status
            </Button>
          </Link>

          <Link href={`/${country}`}>
            <Button variant="ghost" className="w-full">
              Back to {config.name}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
