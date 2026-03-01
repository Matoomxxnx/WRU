"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPill() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Autoplay blocked"));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 9999,
      background: "rgba(10, 10, 10, 0.95)", // สีดำเข้มเกือบสนิท
      border: "1px solid rgba(204, 34, 0, 0.5)", // เส้นขอบสีแดง WRU แบบโปร่งแสง
      padding: "8px 12px",
      borderRadius: "4px", // คงความเหลี่ยมแบบ Minimal
      display: "flex",
      alignItems: "center",
      gap: "10px",
      boxShadow: "0 4px 15px rgba(204, 34, 0, 0.15)" // เพิ่มแสง Glow สีแดงจางๆ
    }}>
      <audio 
        ref={audioRef} 
        src="/music/background.mp3" // ตรวจสอบ Path ไฟล์เพลง
        loop 
      />
      
      {/* สถานะเพลง */}
      <div style={{
        fontSize: "10px",
        color: "#cc2200", // สีแดง WRU
        letterSpacing: "3px", // เว้นระยะตัวอักษรให้ดูเท่
        fontWeight: "bold",
        textTransform: "uppercase",
        fontFamily: "'Barlow Condensed', sans-serif" // ใช้ Font เดียวกับหน้าหลัก
      }}>
        {isPlaying ? "NOW PLAYING" : "MUSIC OFF"}
      </div>

      {/* ปุ่มเปิด-ปิดเพลง */}
      <button 
        onClick={togglePlay}
        style={{
          background: isPlaying ? "transparent" : "#cc2200", // ถ้าปิดอยู่ ปุ่มจะเป็นสีแดง
          border: `1px solid ${isPlaying ? "rgba(255,255,255,0.3)" : "#cc2200"}`,
          color: isPlaying ? "#fff" : "#000", // ถ้าเปิดอยู่ ตัวหนังสือขาว, ถ้าปิดอยู่ ตัวหนังสือดำ
          fontSize: "9px",
          padding: "4px 8px",
          cursor: "pointer",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: "600",
          fontFamily: "'Barlow Condensed', sans-serif",
          transition: "all 0.3s ease", // เพิ่ม Animation เวลากด
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isPlaying ? "transparent" : "#cc2200";
          e.currentTarget.style.color = isPlaying ? "#fff" : "#000";
          e.currentTarget.style.borderColor = isPlaying ? "rgba(255,255,255,0.3)" : "#cc2200";
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}