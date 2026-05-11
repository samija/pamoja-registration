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
  searchParams: Promise<{ tx_ref?: string }>;
}) {
  const { country } = await params;
  const { tx_ref } = await searchParams;
  const config = getCountryConfig(country);
  if (!config) notFound();

  return (
    <div className="bg-pamoja-cream min-h-screen flex items-center justify-center px-4">
      <Card variant="elevated" className="max-w-md w-full text-center">
        <div className="text-5xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">
          Registration Complete!
        </h1>
        <p className="text-pamoja-charcoal-light mb-6">
          Thank you for registering for Pamoja Africa V. You will receive a confirmation email shortly.
        </p>
        {tx_ref && (
          <p className="text-xs text-pamoja-muted mb-6">
            Reference: {tx_ref}
          </p>
        )}
        <Link href={`/${country}`}>
          <Button variant="outline">Back to {config.name}</Button>
        </Link>
      </Card>
    </div>
  );
}
