"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ✅ เหลือปุ่มเดียว MEENPRO
const partners = [{ name: "MEENPRO", href: "/meenpro", featured: true }];

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function Page() {
  // 🔥 TYPEWRITER LOOP
  const text = "MEENPRO";
  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 140;
    const deleteSpeed = 80;
    const pauseAfterType = 900;
    const pauseAfterDel = 300;

    let timeout: any;

    if (!deleting) {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setTyped((prev) => prev + text[index]);
          setIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pauseAfterType);
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => {
          setTyped((prev) => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setDeleting(false);
          setIndex(0);
        }, pauseAfterDel);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, deleting, typed]);

  // ✅ เพลง (ต้องมีไฟล์จริงใน public/music)
  const SONG = {
    title: "KMP IN MY HEART",
    artist: "KINGMEENPRO",
    audioSrc: "/music/song.mp3",
    coverSrc: "/music/cover.jpg",
  };

  // ✅ Player states
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // ✅ ย่อ/ขยาย
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

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

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
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
    <main className="flex-1">
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-pulse-slow"
            style={{
              backgroundImage:
                "url(https://img2.pic.in.th/96d43ace-5695-4dd5-a501-2f20a44ecae4.jpg)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]/90 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] z-20" />
        </div>

        {/* ✅ audio */}
        <audio ref={audioRef} src={SONG.audioSrc} preload="metadata" />

        <div className="relative z-10 flex flex-col items-center w-full max-w-[1600px] px-4 py-6 h-full">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Title */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/90 mb-3 min-h-[1.2em]">
                {typed}
                <span className="inline-block ml-2 w-1 md:w-2 h-10 md:h-16 lg:h-20 bg-white align-bottom mb-2 md:mb-4 animate-pulse" />
              </h1>

              <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.5em] md:tracking-[0.8em]">
                BORN OF MEENPRO
              </p>
            </div>

            {/* Emblem card (กลับมาเป็นรูปโลโก้เหมือนเดิม) */}
            <div className="relative w-full max-w-3xl aspect-video md:aspect-[2.5/1] bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden group my-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 transform group-hover:scale-105 transition-transform duration-700">
                <img
                  src="/uploads/meenpro.png"
                  alt="MEENPRO Emblem"
                  className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                />
              </div>
            </div>

            {/* ✅ เหลือปุ่มเดียว */}
            <div className="flex flex-col items-center w-full mt-6 mb-2">
              <div className="flex justify-center items-center w-full max-w-7xl">
                {partners.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    className={[
                      "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl overflow-hidden transition-all duration-300",
                      "w-full max-w-md md:max-w-xl h-24 md:h-32 bg-[#161616] border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] z-10",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="font-bold uppercase tracking-wider text-center px-2 truncate w-full text-lg md:text-2xl text-white">
                        {p.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Floating Music Player - Bottom Right */}
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
                    <div className="text-[14px] font-semibold uppercase truncate">
                      {SONG.title}
                    </div>
                    <div className="text-[11px] uppercase text-white/55 truncate mt-1">
                      {SONG.artist}
                    </div>
                  </div>
                </div>

                {/* progress */}
                <div className="mt-5">
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-white/85" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-[11px] text-white/50">
                    <span>{formatTime(current)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* controls */}
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
                <div className="text-[12px] font-semibold uppercase truncate">
                  {SONG.title}
                </div>
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
      </section>
    </main>
  );
}