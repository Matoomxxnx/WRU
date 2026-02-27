import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const code = String(body?.code ?? "").trim();

  const real = String(process.env.ADMIN_CODE ?? "").trim();

  if (!real) {
    return NextResponse.json(
      { ok: false, message: "ADMIN_CODE is not set on server" },
      { status: 500 }
    );
  }

  const ok = code === real;
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}