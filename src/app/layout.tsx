import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import PageEnterLoader from "./components/PageEnterLoader";
import MusicPill from "./components/MusicPill"; // ✅ import ตรงได้

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
      <body className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        <PageEnterLoader>{children}</PageEnterLoader>

      </body>
    </html>
  );
}