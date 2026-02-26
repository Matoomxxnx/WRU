"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  artist?: string;
  cover: string;
  volume?: number; // 0-1
  loop?: boolean;
};

export default function MusicPill({
  src,
  title,
  artist = "MEENPRO",
  cover,
  volume = 0.2,
  loop = true,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.min(1, Math.max(0, volume));
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) {
        await a.play();
        setPlaying(true);
      } else {
        a.pause();
        setPlaying(false);
      }
    } catch {
      // บาง browser จะ block autoplay ต้องกดปุ่มก่อน
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <audio ref={audioRef} src={src} loop={loop} />
      <button
        onClick={toggle}
        className="px-3 py-2 rounded-lg border border-white/20 bg-black/60 text-white text-xs"
        title={`${title} - ${artist}`}
      >
        {playing ? "PAUSE" : "PLAY"}
      </button>
      {/* ใช้ cover ได้ตาม UI ของคุณ */}
      <img src={cover} alt="cover" className="hidden" />
    </div>
  );
}