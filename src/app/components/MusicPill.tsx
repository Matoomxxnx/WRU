"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPill() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

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
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      fontFamily: "'Barlow Condensed', sans-serif",
    }}>
      <audio ref={audioRef} src="/music/background.mp3" loop />

      {!isMinimized ? (
        <div style={{
          background: "rgba(10, 10, 10, 0.98)",
          border: "1px solid #cc2200",
          padding: "12px",
          display: "flex",
          alignItems: "center",
          gap: "15px", // ระยะห่างระหว่างรูปกับข้อความ
          boxShadow: "0 0 25px rgba(204, 34, 0, 0.3)",
          position: "relative",
          minWidth: "280px"
        }}>
          {/* ปุ่มปิด (X) */}
          <button 
            onClick={() => setIsMinimized(true)}
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              background: "#cc2200",
              color: "#fff",
              border: "none",
              width: "18px",
              height: "18px",
              fontSize: "10px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ×
          </button>

          {/* --- ส่วนของรูปภาพ --- */}
          <div style={{
            width: "50px",
            height: "50px",
            border: "1px solid #333",
            overflow: "hidden",
            flexShrink: 0 // ป้องกันรูปโดนบีบ
          }}>
            <img 
              src="/images/music-cover.jpg" // <--- ใส่ Path รูปของคุณตรงนี้
              alt="Cover"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "9px", color: "#cc2200", letterSpacing: "2px", fontWeight: "bold" }}>
              NOW PLAYING
            </span>
            <span style={{ fontSize: "14px", color: "#fff", fontWeight: "800", letterSpacing: "1px" }}>
              WRU BACKGROUND THEME
            </span>
            <span style={{ fontSize: "10px", color: "#666" }}>SYSTEM_AUDIO_CONNECTED</span>
          </div>

          <button 
            onClick={togglePlay}
            style={{
              background: isPlaying ? "transparent" : "#cc2200",
              border: `1px solid ${isPlaying ? "#fff" : "#cc2200"}`,
              color: isPlaying ? "#fff" : "#000",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "10px",
              fontWeight: "bold"
            }}
          >
            {isPlaying ? "||" : "▶"}
          </button>
        </div>
      ) : (
        /* ปุ่มเรียกคืนตอนพับเก็บ */
        <button 
          onClick={() => setIsMinimized(false)}
          style={{
            background: "#000",
            border: "1px solid #cc2200",
            color: "#cc2200",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold"
          }}
        >
          AUDIO MODULE [+]
        </button>
      )}
    </div>
  );
}