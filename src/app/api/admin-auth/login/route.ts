import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const input = String((body as any)?.code ?? "").trim();
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

/* กันคนเปิด GET แล้วงง */
export async function GET() {
  return NextResponse.json({ ok: true, hint: "POST { code }" });
}