import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // ป้องกันการค้างของข้อมูลเก่า (Cache)

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
    const { name, gang_slug, image_url, facebook_url } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // แก้ไข: ใช้ .select() แทน .select().single() เพื่อลดโอกาส Error 500 กรณี Insert สำเร็จแต่คืนค่าผิดรูปแบบ
    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({ 
        name, 
        gang_slug: gang_slug || null, // เปลี่ยนจาก "" เป็น null ถ้า DB อนุญาต เพื่อความถูกต้องของ Schema
        image_url: image_url || "", 
        facebook_url: facebook_url || "" 
      })
      .select();

    if (error) {
      // Log รายละเอียด Error ลงใน Vercel/Terminal เพื่อให้ Debug ง่ายขึ้น
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    // สั่งให้ Next.js ล้าง Cache หน้าสมาชิกเพื่อให้รายชื่อใหม่ปรากฏทันที
    revalidatePath("/members");
    revalidatePath("/admin/members"); // ใส่ path หน้าที่แสดงรายชื่อทั้งหมดของคุณ

    return NextResponse.json(data[0]); // คืนค่าแถวแรกที่เพิ่มเข้าไป
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}