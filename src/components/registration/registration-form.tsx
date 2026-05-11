"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { CountryConfig } from "@/config/countries";
import type { ConferencePricing } from "@/config/conferences";
import { conferences } from "@/config/conferences";

interface Props {
  countrySlug: string;
  countryConfig: CountryConfig;
  pricing: ConferencePricing[];
  defaultConference?: string;
}

type Step = "conference" | "details" | "review";

interface FormData {
  conferenceId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  organization: string;
  role: string;
  city: string;
  directoryOptIn: boolean;
}

const STEPS: { key: Step; label: string }[] = [
  { key: "conference", label: "Conference" },
  { key: "details", label: "Your Details" },
  { key: "review", label: "Review & Pay" },
];

export function RegistrationForm({ countrySlug, countryConfig, pricing, defaultConference }: Props) {
  const [step, setStep] = useState<Step>(defaultConference ? "details" : "conference");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [form, setForm] = useState<FormData>({
    conferenceId: defaultConference || "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    organization: "",
    role: "",
    city: "",
    directoryOptIn: false,
  });

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validateDetails(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.gender) errs.gender = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const selectedPricing = pricing.find((p) => p.conferenceId === form.conferenceId);
  const selectedConf = conferences.find((c) => c.id === form.conferenceId);

  const currentStepIdx = STEPS.findIndex((s) => s.key === step);

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countrySlug,
          ...form,
        }),
      });

      const data = await res.json();

      if (data.waitlisted) {
        window.location.href = `/${countrySlug}/register/success?waitlisted=true`;
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.error) {
        alert(data.error);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                i <= currentStepIdx
                  ? "bg-pamoja-lime text-pamoja-green-deep"
                  : "bg-pamoja-border text-pamoja-muted"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-sm hidden sm:block ${
                i <= currentStepIdx ? "text-pamoja-charcoal font-medium" : "text-pamoja-muted"
              }`}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`w-8 h-px ${i < currentStepIdx ? "bg-pamoja-lime" : "bg-pamoja-border"}`} />
            )}
          </div>
        ))}
      </div>

      <Card variant="elevated">
        {/* Step 1: Conference Selection */}
        {step === "conference" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-pamoja-charcoal mb-4">
              Select Your Conference
            </h2>
            {pricing.map((p) => {
              const conf = conferences.find((c) => c.id === p.conferenceId);
              if (!conf) return null;
              const selected = form.conferenceId === p.conferenceId;
              return (
                <button
                  key={p.conferenceId}
                  type="button"
                  onClick={() => update("conferenceId", p.conferenceId)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selected
                      ? "border-pamoja-lime bg-pamoja-lime/5"
                      : "border-pamoja-border hover:border-pamoja-charcoal/20"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-pamoja-charcoal">{conf.name}</p>
                      <p className="text-sm text-pamoja-muted mt-1">
                        {conf.startDate} — {conf.endDate}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-pamoja-charcoal">
                      {countryConfig.currencySymbol}{p.priceLocal.toLocaleString()}
                    </p>
                  </div>
                </button>
              );
            })}
            <div className="pt-4 flex justify-end">
              <Button
                disabled={!form.conferenceId}
                onClick={() => setStep("details")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === "details" && (
          <div className="space-y-5">
            <h2 className="text-xl font-semibold text-pamoja-charcoal mb-4">
              Your Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                error={errors.lastName}
                required
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
              required
            />
            <Input
              label="Phone"
              type="tel"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              error={errors.phone}
              placeholder={countryConfig.contactPhone}
              required
            />
            <Select
              label="Gender"
              value={form.gender}
              onChange={(e) => update("gender", e.target.value)}
              error={errors.gender}
              placeholder="Select gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <Input
              label="Organization / Church"
              value={form.organization}
              onChange={(e) => update("organization", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Role / Title"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="e.g. Student, Pastor, Staff"
              />
              <Input
                label="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>

            {/* Directory opt-in */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.directoryOptIn}
                onChange={(e) => update("directoryOptIn", e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-pamoja-border text-pamoja-lime focus:ring-pamoja-lime"
              />
              <span className="text-sm text-pamoja-charcoal-light">
                List me in the public attendee directory so other delegates can connect with me.
              </span>
            </label>

            <div className="pt-4 flex justify-between">
              <Button variant="ghost" onClick={() => setStep("conference")}>
                Back
              </Button>
              <Button
                onClick={() => {
                  if (validateDetails()) setStep("review");
                }}
              >
                Review
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Pay */}
        {step === "review" && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-pamoja-charcoal mb-4">
              Review & Pay
            </h2>

            {/* Summary */}
            <div className="bg-pamoja-cream rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-pamoja-muted">Conference</span>
                <span className="text-sm font-medium">{selectedConf?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-pamoja-muted">Name</span>
                <span className="text-sm font-medium">{form.firstName} {form.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-pamoja-muted">Email</span>
                <span className="text-sm font-medium">{form.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-pamoja-muted">Phone</span>
                <span className="text-sm font-medium">{form.phone}</span>
              </div>
              {form.organization && (
                <div className="flex justify-between">
                  <span className="text-sm text-pamoja-muted">Organization</span>
                  <span className="text-sm font-medium">{form.organization}</span>
                </div>
              )}
              <hr className="border-pamoja-border" />
              <div className="flex justify-between">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-bold text-pamoja-charcoal">
                  {countryConfig.currencySymbol}
                  {selectedPricing?.priceLocal.toLocaleString()} {selectedPricing?.currency}
                </span>
              </div>
            </div>

            <p className="text-xs text-pamoja-muted">
              You will be redirected to {countryConfig.paymentGateway === "chapa" ? "Chapa" : countryConfig.paymentGateway} to complete your payment via Telebirr, bank transfer, or card.
            </p>

            <div className="pt-2 flex justify-between">
              <Button variant="ghost" onClick={() => setStep("details")}>
                Back
              </Button>
              <Button loading={loading} onClick={handleSubmit} size="lg">
                Pay {countryConfig.currencySymbol}
                {selectedPricing?.priceLocal.toLocaleString()}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
