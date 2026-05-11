"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { showToast, ToastContainer } from "@/components/ui/toast";

interface ParsedRow {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  organization: string;
  role: string;
  city: string;
  valid: boolean;
  error?: string;
}

export default function ImportPage() {
  const [countrySlug, setCountrySlug] = useState("ethiopia");
  const [conferenceId, setConferenceId] = useState("pamoja-v");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [imported, setImported] = useState(0);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter((l) => l.trim());
      if (lines.length < 2) return;

      // Parse header
      const header = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));
      const colMap: Record<string, number> = {};
      header.forEach((h, i) => {
        if (h.includes("first")) colMap.firstName = i;
        else if (h.includes("last")) colMap.lastName = i;
        else if (h.includes("email")) colMap.email = i;
        else if (h.includes("phone")) colMap.phone = i;
        else if (h.includes("gender")) colMap.gender = i;
        else if (h.includes("org") || h.includes("church")) colMap.organization = i;
        else if (h.includes("role") || h.includes("title")) colMap.role = i;
        else if (h.includes("city")) colMap.city = i;
      });

      const parsed = lines.slice(1).map((line) => {
        const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        const row: ParsedRow = {
          firstName: cols[colMap.firstName] || "",
          lastName: cols[colMap.lastName] || "",
          email: cols[colMap.email] || "",
          phone: cols[colMap.phone] || "",
          gender: cols[colMap.gender] || "",
          organization: cols[colMap.organization] || "",
          role: cols[colMap.role] || "",
          city: cols[colMap.city] || "",
          valid: true,
        };

        // Validate
        if (!row.firstName || !row.lastName) { row.valid = false; row.error = "Missing name"; }
        else if (!row.email || !row.email.includes("@")) { row.valid = false; row.error = "Invalid email"; }

        return row;
      });

      setRows(parsed);
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    const validRows = rows.filter((r) => r.valid);
    if (validRows.length === 0) return;
    setLoading(true);

    const res = await fetch("/api/admin/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        countrySlug,
        conferenceId,
        registrants: validRows,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setImported(data.imported);
      showToast(`Imported ${data.imported} registrants (${data.skipped} skipped)`, "success");
    } else {
      showToast(data.error || "Import failed", "error");
    }
    setLoading(false);
  }

  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.filter((r) => !r.valid).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-pamoja-charcoal mb-2">Import Registrants</h1>
      <p className="text-pamoja-charcoal-light mb-8">
        Upload a CSV file with columns: First Name, Last Name, Email, Phone, Gender, Organization, Role, City
      </p>

      <ToastContainer />

      <Card variant="elevated" className="mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Country"
            value={countrySlug}
            onChange={(e) => setCountrySlug(e.target.value)}
            options={[
              { value: "ethiopia", label: "Ethiopia" },
              { value: "kenya", label: "Kenya" },
              { value: "nigeria", label: "Nigeria" },
            ]}
          />
          <Select
            label="Conference"
            value={conferenceId}
            onChange={(e) => setConferenceId(e.target.value)}
            options={[
              { value: "pamoja-v", label: "Pamoja Africa V" },
              { value: "staff-conference", label: "Staff Conference" },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pamoja-charcoal mb-1.5">CSV File</label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-pamoja-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pamoja-lime file:text-pamoja-green-deep hover:file:bg-pamoja-lime/90"
          />
        </div>
      </Card>

      {/* Preview */}
      {rows.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="success">{validCount} valid</Badge>
            {invalidCount > 0 && <Badge variant="error">{invalidCount} invalid</Badge>}
            <span className="text-sm text-pamoja-muted">{rows.length} total rows</span>
            {imported > 0 && <Badge variant="info">{imported} imported</Badge>}
          </div>

          <Card variant="elevated" className="overflow-hidden p-0 mb-6">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-pamoja-cream/50 border-b border-pamoja-border sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium w-8">#</th>
                    <th className="px-3 py-2 text-left font-medium">Name</th>
                    <th className="px-3 py-2 text-left font-medium">Email</th>
                    <th className="px-3 py-2 text-left font-medium">Phone</th>
                    <th className="px-3 py-2 text-left font-medium">Org</th>
                    <th className="px-3 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pamoja-border/50">
                  {rows.slice(0, 50).map((r, i) => (
                    <tr key={i} className={r.valid ? "" : "bg-red-50"}>
                      <td className="px-3 py-2 text-pamoja-muted">{i + 1}</td>
                      <td className="px-3 py-2">{r.firstName} {r.lastName}</td>
                      <td className="px-3 py-2 text-pamoja-charcoal-light">{r.email}</td>
                      <td className="px-3 py-2 text-pamoja-charcoal-light">{r.phone}</td>
                      <td className="px-3 py-2 text-pamoja-charcoal-light">{r.organization}</td>
                      <td className="px-3 py-2">
                        {r.valid ? (
                          <Badge variant="success">Valid</Badge>
                        ) : (
                          <Badge variant="error">{r.error}</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Button onClick={handleImport} loading={loading} disabled={validCount === 0}>
            Import {validCount} Registrants
          </Button>
        </>
      )}
    </div>
  );
}
