"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
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
      background: "rgba(0,0,0,0.8)",
      border: "1px solid #cc2200",
      padding: "10px 15px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }}>
      <audio 
        ref={audioRef} 
        src="/music/background.mp3" // ใส่ไฟล์เพลงไว้ใน public/music/background.mp3
        loop 
      />
      <div style={{ fontSize: "10px", color: "#cc2200", letterSpacing: "2px", fontWeight: "bold" }}>
        {isPlaying ? "NOW PLAYING" : "MUSIC OFF"}
      </div>
      <button 
        onClick={togglePlay}
        style={{
          background: "transparent",
          border: "1px solid #fff",
          color: "#fff",
          fontSize: "10px",
          padding: "4px 8px",
          cursor: "pointer",
          textTransform: "uppercase"
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}