import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server"; // เช็ค path ให้ถูก (อาจเป็น ../../../ หรือ ../../../../)
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

// POST — เพิ่มสมาชิกใหม่ (อันนี้แหละที่ทำให้ปุ่ม Add Member ทำงาน)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ดึงค่า role ออกมาจาก body ด้วย
    const { name, gang_slug, image_url, facebook_url, role } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({ 
        name, 
        role: role || "Member", // บันทึก role ลงไป ถ้าไม่มีให้เป็น Member
        gang_slug: gang_slug || null, 
        image_url: image_url || "", 
        facebook_url: facebook_url || "" 
      })
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ล้างแคชเพื่อให้ข้อมูลแสดงผลทันที
    revalidatePath("/members"); 
    revalidatePath("/admin/members"); 

    return NextResponse.json(data[0]); 
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}