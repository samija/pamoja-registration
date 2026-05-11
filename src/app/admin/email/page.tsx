"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { showToast, ToastContainer } from "@/components/ui/toast";

export default function EmailBlastPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  async function handleSend() {
    if (!subject || !body) return;
    setLoading(true);

    const res = await fetch("/api/admin/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject,
        body,
        filter: status ? { status } : undefined,
      }),
    });

    const data = await res.json();
    if (data.success) {
      showToast(`Sent to ${data.sent}/${data.total} recipients`, "success");
      setSubject("");
      setBody("");
    } else {
      showToast(data.error || "Failed to send", "error");
    }
    setLoading(false);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Email Blast</h1>
      <p className="text-pamoja-charcoal-light mb-8">
        Send an email to all or filtered registrants. Use <code className="bg-pamoja-cream px-1 rounded text-xs">{"{{name}}"}</code> to personalize.
      </p>

      <ToastContainer />

      <Card variant="elevated" className="space-y-5">
        <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Important update about Pamoja Africa V" required />

        <Textarea
          label="Body (HTML)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={10}
          placeholder={"<p>Dear {{name}},</p>\n<p>We are excited to share...</p>"}
          className="font-mono"
          required
        />

        <Select
          label="Filter by status (optional)"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "", label: "All registrants" },
            { value: "confirmed", label: "Confirmed only" },
            { value: "pending", label: "Pending only" },
            { value: "waitlisted", label: "Waitlisted only" },
          ]}
        />

        {/* Preview */}
        {preview && body && (
          <Card className="bg-pamoja-cream">
            <p className="text-xs text-pamoja-muted mb-2">Preview:</p>
            <div className="text-sm text-pamoja-charcoal" dangerouslySetInnerHTML={{ __html: body.replace(/\{\{name\}\}/g, "John") }} />
          </Card>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={() => setPreview(!preview)}>
            {preview ? "Hide Preview" : "Preview"}
          </Button>
          <Button onClick={handleSend} loading={loading} disabled={!subject || !body}>
            Send Email Blast
          </Button>
        </div>
      </Card>
    </div>
  );
}
