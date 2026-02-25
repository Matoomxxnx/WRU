"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GlobalPlayer() {
  const SONG = {
    title: "KMP IN MY HEART",
    artist: "KINGMEENPRO",
    audioSrc: "/music/song.mp3",
    coverSrc: "/music/cover.jpg",
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [minimized, setMinimized] = useState(false);

  // ✅ จำสถานะ (ย่อ/เสียง/เล่นอยู่ไหม) ข้ามรีเฟรช
  useEffect(() => {
    try {
      const saved = localStorage.getItem("global_player_v1");
      if (saved) {
        const j = JSON.parse(saved);
        if (typeof j.volume === "number") setVolume(j.volume);
        if (typeof j.minimized === "boolean") setMinimized(j.minimized);
        if (typeof j.current === "number") setCurrent(j.current);
        if (typeof j.isPlaying === "boolean") setIsPlaying(j.isPlaying);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "global_player_v1",
        JSON.stringify({ volume, minimized, current, isPlaying })
      );
    } catch {}
  }, [volume, minimized, current, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    // restore time
    if (current > 0 && Number.isFinite(current)) {
      try {
        a.currentTime = current;
      } catch {}
    }

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);

    // restore play (ถ้าผู้ใช้เคยกดเล่นเอง)
    // browser บางตัวจะ block autoplay อยู่แล้ว แต่ไม่ error
    if (isPlaying) {
      a.play().catch(() => {});
    }

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch {}
  };

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (current / duration) * 100));
  }, [current, duration]);

  return (
    <>
      <audio ref={audioRef} src={SONG.audioSrc} preload="metadata" />

      {/* ✅ Floating Bottom Right (ทุกหน้า) */}
      <div className="fixed bottom-6 right-6 z-[999] w-[92vw] sm:w-[380px]">
        {!minimized ? (
          <div className="rounded-3xl bg-white/[0.06] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] overflow-hidden backdrop-blur-md">
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-white/60">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <span>NOW PLAYING</span>
              </div>

              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="text-white/40 hover:text-white/70 transition p-2 -m-2"
                aria-label="minimize"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5l5-5z" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-[56px] h-[56px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={SONG.coverSrc} alt="cover" className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <div className="text-[14px] font-semibold uppercase truncate">{SONG.title}</div>
                  <div className="text-[11px] uppercase text-white/55 truncate mt-1">
                    {SONG.artist}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/85" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px] text-white/50">
                  <span>{formatTime(current)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-[150px] accent-white"
                />

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white text-black grid place-items-center"
                  aria-label={isPlaying ? "pause" : "play"}
                  type="button"
                >
                  {isPlaying ? (
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-6 bg-black rounded" />
                      <span className="w-1.5 h-6 bg-black rounded" />
                    </div>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md shadow-[0_25px_70px_rgba(0,0,0,0.65)] px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMinimized(false)}
              className="w-9 h-9 rounded-full overflow-hidden border border-white/10 bg-black/40"
              aria-label="expand"
            >
              <img src={SONG.coverSrc} alt="cover" className="w-full h-full object-cover" />
            </button>

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-semibold uppercase truncate">{SONG.title}</div>
            </div>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black grid place-items-center"
              aria-label={isPlaying ? "pause" : "play"}
              type="button"
            >
              {isPlaying ? (
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-5 bg-black rounded" />
                  <span className="w-1.5 h-5 bg-black rounded" />
                </div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}