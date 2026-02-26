import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import MusicPill from "./components/MusicPill";
import PageEnterLoader from "./components/PageEnterLoader";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MEENPRO",
  description: "BORN OF MEENPRO",
  openGraph: {
    title: "MEENPRO",
    description: "BORN OF MEENPRO",
    images: ["/uploads/meenpro.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body
        className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        {/* ✅ ครอบ children ด้วย Loader */}
        <PageEnterLoader>
          {children}
        </PageEnterLoader>

        {/* ✅ เพลงทุกหน้า */}
        <MusicPill
          src="/music/song.mp3"
          title="One Of The Girls"
          artist="The Weeknd"
          cover="/music/cover.jpg"
          volume={0.2}
          loop
        />

        {/* ✅ Footer — อยู่ล่างสุด ไม่ fixed ต้อง scroll ลงถึงจะเจอ */}
        <footer className="w-full" style={{ background: "#000" }}>
          <div
            className="mx-auto w-[80%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}
          />
          <div className="py-4 text-center">
            <p
              className="uppercase"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.45em",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              SYSTEM DESIGN BY{" "}
              <a
                href="https://www.facebook.com/matoom1123"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "rgba(255,255,255,0.55)", fontWeight: 700, textDecoration: "none" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#fff")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
              >
                Matoom Wellesley
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}