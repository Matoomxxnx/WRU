import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, gang_slug, image_url, facebook_url, role } = body;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({ 
        name, 
        role: role || "Member", // ตอนนี้ DB มีคอลัมน์นี้แล้ว จะไม่ Error แล้วครับ
        gang_slug: gang_slug || null, 
        image_url: image_url || "", 
        facebook_url: facebook_url || "" 
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/members");
    revalidatePath("/admin/members");

    return NextResponse.json(data[0]);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}