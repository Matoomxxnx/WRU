import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = (await req.json().catch(() => ({}))) as { code?: string };

  const input = String(code ?? "").trim();
  const real = String(process.env.ADMIN_CODE ?? "").trim();

  if (!real) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_CODE is not set" },
      { status: 500 }
    );
  }

  const ok = input === real;
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}