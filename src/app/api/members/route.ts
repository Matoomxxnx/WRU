import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";

export const runtime = "nodejs";

// GET — ดึงสมาชิกทั้งหมด
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — เพิ่มสมาชิกใหม่
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, gang_slug, image_url, facebook_url } = body;

  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("members")
    .insert({ name, gang_slug: gang_slug ?? "", image_url: image_url ?? "", facebook_url: facebook_url ?? "" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}