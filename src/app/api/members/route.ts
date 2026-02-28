import { NextResponse } from "next/server";

export const runtime = "nodejs"; // สำคัญ: ให้ log ทำงานชัวร์บน Vercel

export async function GET() {
  try {
    // 🔥 ใส่ log ชัวร์ๆ
    console.log("[api/members] hit");

    // TODO: โค้ดเดิมของคุณที่ดึงสมาชิก
    // ตัวอย่าง: const members = await ...
    const members: any[] = [];

    return NextResponse.json({ ok: true, members }, { status: 200 });
  } catch (e: any) {
    console.error("[api/members] error:", e);

    return NextResponse.json(
      {
        ok: false,
        message: e?.message ?? String(e),
        stack: e?.stack ?? null,
        members: [],
      },
      { status: 500 }
    );
  }
}