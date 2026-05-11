import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Upload a document for verification */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const registrantId = formData.get("registrantId") as string;
    const docType = formData.get("type") as string || "id_card";

    if (!file || !registrantId) {
      return NextResponse.json({ error: "File and registrantId required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Upload to Supabase Storage
    const ext = file.name.split(".").pop();
    const path = `${registrantId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Create document record
    const { data: doc, error: docError } = await supabase
      .from("documents")
      .insert({
        registrant_id: registrantId,
        type: docType,
        file_path: path,
        file_name: file.name,
        status: "pending",
      })
      .select("id")
      .single();

    if (docError) {
      return NextResponse.json({ error: "Failed to save document record" }, { status: 500 });
    }

    return NextResponse.json({ success: true, documentId: doc?.id });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** Review a document (admin only) */
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { documentId, status, reviewNote } = await req.json();
    if (!documentId || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { error } = await supabase
      .from("documents")
      .update({
        status,
        reviewed_by: user.id,
        review_note: reviewNote || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Document review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
