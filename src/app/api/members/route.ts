import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; 

// GET — ดึงสมาชิกทั้งหมด
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("members")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST — เพิ่มสมาชิกใหม่
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // 1. เพิ่ม role เข้ามาในตัวแปรที่รับจาก body
    const { name, gang_slug, image_url, facebook_url, role } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({ 
        name, 
        role: role || "Member", // 2. บันทึกค่า role ลงใน Database
        gang_slug: gang_slug || null, 
        image_url: image_url || "", 
        facebook_url: facebook_url || "" 
      })
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ล้างแคชเพื่อให้หน้าสมาชิกอัปเดตทันที
    revalidatePath("/members"); 
    revalidatePath("/admin/members"); 
    revalidatePath("/", "layout");

    return NextResponse.json(data[0]); 
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}