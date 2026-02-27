import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ชัวร์สุดบน vercel

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/admin-auth" });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as any));
  const input = String((body as any)?.code ?? "").trim();
  const real = String(process.env.ADMIN_CODE ?? "").trim();

  if (!real) {
    return NextResponse.json({ ok: false, message: "ADMIN_CODE not set" }, { status: 500 });
  }

  const ok = input === real;
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}