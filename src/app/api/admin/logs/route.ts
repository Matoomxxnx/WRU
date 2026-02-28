import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-server";

// GET - ดึง logs ทั้งหมด
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST - เพิ่ม log ใหม่
export async function POST(req: NextRequest) {
  const { action, detail } = await req.json();
  const { error } = await supabaseAdmin
    .from("logs")
    .insert({ action, detail });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE - ลบ log ทั้งหมด
export async function DELETE() {
  const { error } = await supabaseAdmin
    .from("logs")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // delete all

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}