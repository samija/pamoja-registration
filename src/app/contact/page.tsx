"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, category, message }),
    });

    if (res.ok) {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pamoja-charcoal mb-4">Contact Us</h1>
        <p className="text-pamoja-charcoal-light max-w-xl mx-auto">
          Have a question about Pamoja Africa V? Reach out to our team or find your national office below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Form */}
        <div>
          {sent ? (
            <Card variant="elevated" className="text-center py-12">
              <p className="text-4xl mb-4">&#10003;</p>
              <h2 className="text-xl font-bold text-pamoja-charcoal mb-2">Message Sent!</h2>
              <p className="text-pamoja-charcoal-light mb-6">We&apos;ll get back to you within 48 hours.</p>
              <Button variant="outline" onClick={() => setSent(false)}>Send Another</Button>
            </Card>
          ) : (
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-pamoja-charcoal mb-4">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Select
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Select a topic"
                  options={[
                    { value: "registration", label: "Registration Help" },
                    { value: "payment", label: "Payment Issue" },
                    { value: "visa", label: "Visa & Travel" },
                    { value: "accommodation", label: "Accommodation" },
                    { value: "group", label: "Group Registration" },
                    { value: "sponsorship", label: "Sponsorship & Partnership" },
                    { value: "other", label: "Other" },
                  ]}
                  required
                />
                <Textarea
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">Send Message</Button>
              </form>
            </Card>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <Card variant="elevated">
            <h3 className="font-semibold text-pamoja-charcoal mb-3">General Inquiries</h3>
            <p className="text-sm text-pamoja-charcoal-light">info@runpamoja.org</p>
            <p className="text-sm text-pamoja-charcoal-light">+251 911 000 000</p>
          </Card>

          <Card variant="elevated">
            <h3 className="font-semibold text-pamoja-charcoal mb-3">National Offices</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-pamoja-charcoal">Ethiopia Office</p>
                <p className="text-pamoja-charcoal-light">ethiopia@runpamoja.org — +251 911 000 000</p>
              </div>
              <div>
                <p className="font-medium text-pamoja-charcoal">Kenya Office</p>
                <p className="text-pamoja-charcoal-light">kenya@runpamoja.org — +254 700 000 000</p>
              </div>
              <div>
                <p className="font-medium text-pamoja-charcoal">Nigeria Office</p>
                <p className="text-pamoja-charcoal-light">nigeria@runpamoja.org — +234 800 000 0000</p>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <h3 className="font-semibold text-pamoja-charcoal mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/faq" className="block text-pamoja-green-mid hover:underline">Frequently Asked Questions</Link>
              <Link href="/status" className="block text-pamoja-green-mid hover:underline">Check Registration Status</Link>
              <Link href="/accommodation" className="block text-pamoja-green-mid hover:underline">Accommodation Options</Link>
              <Link href="/venue" className="block text-pamoja-green-mid hover:underline">Venue & Travel Info</Link>
            </div>
          </Card>

          <Card variant="elevated">
            <h3 className="font-semibold text-pamoja-charcoal mb-3">Venue Address</h3>
            <p className="text-sm text-pamoja-charcoal-light">Addis Ababa Convention Center</p>
            <p className="text-sm text-pamoja-charcoal-light">Bole Road, Addis Ababa, Ethiopia</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
