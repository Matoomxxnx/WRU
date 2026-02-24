import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // กันเฉพาะ /admin
  if (!pathname.startsWith("/admin")) return NextResponse.next();

  // อ่าน cookie admin
  const admin = req.cookies.get("admin")?.value;

  // ถ้าไม่ได้ login -> ไป /login
  if (admin !== "1") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};