"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPill() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // เริ่มต้นแบบย่อเพื่อให้เข้ากับธีมเว็บ
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // อ้างอิง Path ตามโครงสร้างไฟล์ในเครื่องคุณ (image_c074fe.png)
  const musicSrc = "/music/background.mp3";
  const coverSrc = "/music/music-cover.jpg";

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
    e.stopPropagation(); 
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play().catch(() => console.log("Autoplay blocked")); }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div style={{ position: "fixed", bottom: "25px", right: "25px", zIndex: 9999, fontFamily: "'Barlow Condensed', sans-serif" }}>
      <audio ref={audioRef} src={musicSrc} loop />

      {!isMinimized ? (
        /* --- [ 1. โหมดขยาย : FULL UI (สไตล์ image_ca715f.png) ] --- */
        <div style={{ background: "rgba(10, 10, 10, 0.98)", border: "1px solid #cc2200", padding: "20px", borderRadius: "12px", boxShadow: "0 0 40px rgba(204, 34, 0, 0.3)", minWidth: "320px", color: "#fff", position: "relative" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", background: "#cc2200", borderRadius: "50%", boxShadow: "0 0 10px #cc2200" }} />
              <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#cc2200", fontWeight: "bold" }}>NOW PLAYING</span>
            </div>
            <button onClick={() => setIsMinimized(true)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "18px" }}>▼</button>
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
             <img src={coverSrc} alt="Cover" style={{ width: "70px", height: "70px", borderRadius: "8px", objectFit: "cover", border: "1px solid #333" }} />
             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", letterSpacing: "1px" }}>WRU SYSTEM THEME</span>
                <span style={{ fontSize: "12px", color: "#888" }}>WHERE ARE YOU</span>
             </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={(e) => {
              const time = Number(e.target.value);
              setCurrentTime(time);
              if (audioRef.current) audioRef.current.currentTime = time;
            }} style={{ width: "100%", accentColor: "#cc2200", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666", marginTop: "5px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "100px" }}>
              <span style={{ fontSize: "12px" }}>{volume === 0 ? "🔇" : "🔈"}</span>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => {
                const v = Number(e.target.value);
                setVolume(v);
                if (audioRef.current) audioRef.current.volume = v;
              }} style={{ width: "100%", accentColor: "#fff", height: "3px" }} />
            </div>

            <button onClick={togglePlay} style={{ background: "#fff", border: "none", width: "45px", height: "45px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "0.2s" }}>
              <span style={{ color: "#000", fontSize: "18px" }}>{isPlaying ? "||" : "▶"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* --- [ 2. โหมดย่อ : CAPSULE UI (สไตล์ image_c07cdc.png) ] --- */
        <div 
          onClick={() => setIsMinimized(false)}
          style={{ 
            background: "rgba(0, 0, 0, 0.95)", border: "1px solid #cc2200", padding: "6px 20px 6px 6px", borderRadius: "40px", 
            display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", boxShadow: "0 0 20px rgba(204, 34, 0, 0.5)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)", minWidth: "160px"
          }}
        >
          <div style={{ position: "relative", width: "40px", height: "40px", flexShrink: 0 }}>
            <img src={coverSrc} alt="C" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", border: `2px solid ${isPlaying ? "#cc2200" : "#444"}` }} />
            <div 
              onClick={togglePlay}
              style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.3)", borderRadius: "50%", color: "#fff", opacity: isPlaying ? 0 : 1 }}
            >
              <span style={{ fontSize: "12px" }}>▶</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
             <span style={{ fontSize: "9px", color: "#cc2200", fontWeight: "bold", letterSpacing: "1px" }}>MUSIC</span>
             <span style={{ fontSize: "13px", color: "#fff", fontWeight: "bold", whiteSpace: "nowrap" }}>
               {isPlaying ? "WRU SYSTEM..." : "PAUSED"}
             </span>
          </div>
        </div>
      )}
    </div>
  );
}