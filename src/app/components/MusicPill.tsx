"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPill() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // เริ่มต้นแบบย่อเพื่อให้ไม่เกะกะ
  const [isVisible, setIsVisible] = useState(true);    // ควบคุมการเปิด-ปิดทั้งหมด
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    return () => {
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // กันไม่ให้ไปโดน Event ขยายหน้าต่าง
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play().catch(() => console.log("Autoplay blocked")); }
    setIsPlaying(!isPlaying);
  };

  // ถ้ากดปิด (X) จะหายไปเลย (หรือจะให้เหลือปุ่มเล็กๆ ไว้เปิดใหม่ก็ได้)
  if (!isVisible) return (
    <button 
      onClick={() => setIsVisible(true)}
      style={{ position: "fixed", bottom: "20px", right: "20px", background: "#000", border: "1px solid #cc2200", color: "#cc2200", padding: "5px 10px", fontSize: "10px", cursor: "pointer", zIndex: 9999 }}
    >
      RECONNECT AUDIO
    </button>
  );

  return (
    <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 9999, fontFamily: "'Barlow Condensed', sans-serif" }}>
      <audio ref={audioRef} src="/music/background.mp3" loop />

      {!isMinimized ? (
        /* --- [ 1. หน้าจอเต็ม : FULL UI ] --- */
        <div style={{ background: "rgba(10, 10, 10, 0.98)", border: "1px solid #cc2200", padding: "16px", borderRadius: "8px", boxShadow: "0 0 30px rgba(204, 34, 0, 0.25)", minWidth: "300px", color: "#fff", position: "relative" }}>
          
          {/* ปุ่มย่อ (V) และ ปุ่มปิด (X) */}
          <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "10px" }}>
            <button onClick={() => setIsMinimized(true)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "12px" }}>▼</button>
            <button onClick={() => setIsVisible(false)} style={{ background: "none", border: "none", color: "#cc2200", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>✕</button>
          </div>
          
          <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
             <img src="/images/music-cover.jpg" alt="Cover" style={{ width: "60px", height: "60px", borderRadius: "4px", objectFit: "cover", border: "1px solid #cc2200" }} />
             <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "10px", color: "#cc2200", letterSpacing: "2px", fontWeight: "bold" }}>NOW PLAYING</span>
                <span style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>WRU SYSTEM THEME</span>
             </div>
          </div>

          <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => {
            const time = Number(e.target.value);
            setCurrentTime(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }} style={{ width: "100%", accentColor: "#cc2200", cursor: "pointer", marginBottom: "15px" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px" }}>Vol</span>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }} style={{ width: "70px", accentColor: "#fff" }} />
            </div>

            <button onClick={togglePlay} style={{ background: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <span style={{ color: "#000", fontSize: "14px" }}>{isPlaying ? "||" : "▶"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* --- [ 2. หน้าจอย่อ : MINIMIZED CAPSULE ] --- */
        <div 
          onClick={() => setIsMinimized(false)}
          style={{ 
            background: "rgba(0, 0, 0, 0.95)", border: "1px solid #cc2200", padding: "6px 15px 6px 6px", borderRadius: "40px", 
            display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", boxShadow: "0 0 20px rgba(204, 34, 0, 0.4)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", maxWidth: "200px"
          }}
        >
          {/* รูปวงกลมพร้อมปุ่ม Play ในตัว */}
          <div style={{ position: "relative", width: "38px", height: "38px", flexShrink: 0 }}>
            <img src="/music/music-cover.jpg" alt="C" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `2px solid ${isPlaying ? "#cc2200" : "#333"}` }} />
            <div 
              onClick={togglePlay}
              style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.3)", borderRadius: "50%", color: "#fff", fontSize: "10px", opacity: isPlaying ? 0 : 1 }}
            >
              {isPlaying ? "" : "▶"}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <span style={{ fontSize: "8px", color: "#cc2200", fontWeight: "bold", letterSpacing: "1.5px" }}>SYSTEM AUDIO</span>
             <span style={{ fontSize: "12px", color: "#fff", fontWeight: "bold", whiteSpace: "nowrap", letterSpacing: "0.5px" }}>
               {isPlaying ? "PLAYING..." : "PAUSED"}
             </span>
          </div>
        </div>
      )}
    </div>
  );
}