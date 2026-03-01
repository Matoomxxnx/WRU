import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-server";

export const runtime = "nodejs";

// PUT — แก้ไขสมาชิก
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, gang_slug, image_url, facebook_url } = body;

  const { data, error } = await supabaseAdmin
    .from("members")
    .update({ name, gang_slug, image_url, facebook_url })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — ลบสมาชิก
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin
    .from("members")
    .delete()
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}