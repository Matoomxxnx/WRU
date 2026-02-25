"use client";

import { useEffect, useState } from "react";

export default function PageEnterLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // ระยะเวลาหน้าโหลดโชว์ (ms)
    const t = setTimeout(() => setShow(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* เนื้อหาเว็บ (ค่อยๆ โผล่) */}
      <div
        className={[
          "transition-all duration-1200 ease-out",
          show ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0",
        ].join(" ")}
      >
        {children}
      </div>

      {/* หน้าจอโหลดทับ (ไม่บล็อกนาน) */}
      {show ? (
        <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-white/15 border-t-white/70 animate-spin" />
            <div className="text-[11px] tracking-[0.55em] uppercase text-white/45">
              LOADING
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}