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
    const { name, gang_slug, image_url, facebook_url } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    // บันทึกข้อมูลลง Supabase
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
      return NextResponse.json({ 
        error: error.message,
        details: error.details
      }, { status: 500 });
    }

    // --- ส่วนสำคัญที่ทำให้ข้อมูลเชื่อมกับหน้า MEMBERS ---
    // ล้าง Cache หน้าสมาชิกเพื่อให้ Next.js ดึงข้อมูลใหม่มาโชว์ทันที
    revalidatePath("/members"); 
    revalidatePath("/(slug)", "layout"); // กรณีใช้ Dynamic Route เช่น /[slug] เพื่อให้หน้า Gang อัปเดตด้วย
    
    return NextResponse.json(data[0]); 
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}