import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // บังคับให้ดึงข้อมูลใหม่เสมอเมื่อมีการเรียก API

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

    const { data, error } = await supabaseAdmin
      .from("members")
      .insert({ 
        name, 
        gang_slug: gang_slug || null, 
        image_url: image_url || "", 
        facebook_url: facebook_url || "" 
      })
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // --- ส่วนที่ทำให้ข้อมูลเชื่อมกับหน้าหน้าสมาชิก ---
    // 1. ล้างแคชหน้า /members (หน้า Roster ที่คุณส่งรูปมา)
    revalidatePath("/members"); 
    // 2. ล้างแคชหน้า admin เพื่อให้รายการในตารางอัปเดต
    revalidatePath("/admin/members"); 
    // 3. ถ้าคุณมีหน้าแยกตามแก็ง (เช่น /[slug]) ให้ล้างแคช Layout ด้วย
    revalidatePath("/", "layout");

    return NextResponse.json(data[0]); 
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}