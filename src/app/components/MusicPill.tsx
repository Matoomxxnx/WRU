"use client";

import { useEffect, useRef, useState } from "react";

export default function MusicPill() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5); // ค่าเริ่มต้น 50%

  // ฟังก์ชันจัดการเวลาเพลง
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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => console.log("Autoplay blocked"));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999, fontFamily: "'Barlow Condensed', sans-serif" }}>
      <audio ref={audioRef} src="/music/background.mp3" loop />

      {!isMinimized ? (
        <div style={{ background: "rgba(15, 15, 15, 0.98)", border: "1px solid #cc2200", padding: "16px", borderRadius: "12px", boxShadow: "0 0 30px rgba(204, 34, 0, 0.25)", minWidth: "320px", color: "#fff" }}>
          
          {/* Header & Minimize */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "6px", height: "6px", background: isPlaying ? "#cc2200" : "#444", borderRadius: "50%", boxShadow: isPlaying ? "0 0 10px #cc2200" : "none" }} />
                <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#cc2200", fontWeight: "bold" }}>NOW PLAYING</span>
             </div>
             <button onClick={() => setIsMinimized(true)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "16px" }}>▼</button>
          </div>

          {/* Info Section */}
          <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
             <img src="/music/music-cover.jpg" alt="Cover" style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover", border: "1px solid #333" }} />
             <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <span style={{ fontSize: "16px", fontWeight: "bold", letterSpacing: "1px" }}>WRU SYSTEM THEME</span>
                <span style={{ fontSize: "12px", color: "#888" }}>WHERE ARE YOU</span>
             </div>
          </div>

          {/* Progress Bar (เลื่อนเพลง) */}
          <div style={{ marginBottom: "10px" }}>
            <input type="range" min="0" max={duration || 0} value={currentTime} onChange={handleSeek} style={{ width: "100%", accentColor: "#cc2200", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#666", marginTop: "4px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* Volume (ปรับเสียง) */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100px" }}>
              <span style={{ fontSize: "14px" }}>{volume === 0 ? "🔇" : "🔈"}</span>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={{ width: "100%", accentColor: "#fff", height: "3px" }} />
            </div>

            {/* Play Button */}
            <button onClick={togglePlay} style={{ background: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "0.2s" }}>
              <span style={{ color: "#000", fontSize: "16px" }}>{isPlaying ? "||" : "▶"}</span>
            </button>
          </div>

        </div>
      ) : (
        <button onClick={() => setIsMinimized(false)} style={{ background: "#000", border: "1px solid #cc2200", color: "#cc2200", padding: "8px 16px", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", boxShadow: "0 0 15px rgba(204, 34, 0, 0.3)" }}>
          OPEN AUDIO MODULE [+]
        </button>
      )}
    </div>
  );
}