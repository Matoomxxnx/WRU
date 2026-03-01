import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-server";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";

// PUT — แก้ไขสมาชิก
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    // 1. เพิ่ม role เข้ามาดึงค่าจาก body ที่ส่งมาจากหน้า Admin
    const { name, gang_slug, image_url, facebook_url, role } = body;

    const { data, error } = await supabaseAdmin
      .from("members")
      .update({ 
        name, 
        role,           // 2. อัปเดตค่าตำแหน่งลง Database
        gang_slug, 
        image_url, 
        facebook_url 
      })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // 3. สั่งล้าง Cache เพื่อให้หน้า Roster อัปเดตทันทีที่แก้ไขเสร็จ
    revalidatePath("/members");
    revalidatePath("/admin/members");

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — ลบสมาชิก
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("members")
      .delete()
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // ล้าง Cache เมื่อมีการลบสมาชิกออก
    revalidatePath("/members");
    revalidatePath("/admin/members");

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}