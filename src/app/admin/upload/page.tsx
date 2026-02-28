"use client";

import { useState, useRef } from "react";
import Link from "next/link";

type UploadedFile = {
  name: string;
  url: string;
  size: number;
};

export default function AdminUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setMessage("");

    const uploaded: UploadedFile[] = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) uploaded.push({ name: file.name, url: data.url, size: file.size });
      } catch (e) { console.error(e); }
    }

    setFiles((prev) => [...uploaded, ...prev]);
    setMessage(`อัปโหลดสำเร็จ ${uploaded.length} ไฟล์`);
    setUploading(false);
  }

  function formatSize(bytes: number) {
    return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>

      <header className="border-b border-zinc-900 bg-black px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><span className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>W<span className="text-red-600">R</span>U</span></Link>
          <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">/ Upload</span>
        </div>
        <Link href="/admin/dashboard" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">← Dashboard</Link>
      </header>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-1">Admin</p>
          <h1 className="text-7xl leading-none uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Upload</h1>
          <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-3">อัปโหลดรูปสมาชิก → Supabase Storage</p>
        </div>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed py-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            dragOver ? "border-white bg-zinc-950" : "border-zinc-800 hover:border-zinc-600"
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files); }}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={(e) => handleUpload(e.target.files)} />
          <div className="text-5xl mb-4 text-zinc-700" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {uploading ? "Uploading..." : "Drop Images Here"}
          </div>
          <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase">
            {uploading ? "กรุณารอสักครู่" : "หรือคลิกเพื่อเลือกไฟล์ · PNG, JPG, WEBP"}
          </p>
        </div>

        {/* Message */}
        {message && (
          <p className="mt-4 text-xs tracking-[0.3em] text-green-500 uppercase">{message}</p>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="mt-8">
            <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase mb-4">Uploaded — {files.length} files</p>
            <div className="border border-zinc-900">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-900 hover:bg-zinc-950 group transition-colors">
                  {/* Preview */}
                  <div className="w-12 h-12 bg-zinc-900 flex-shrink-0 overflow-hidden">
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold tracking-wider uppercase truncate">{file.name}</p>
                    <p className="text-xs text-zinc-600 mt-1">{formatSize(file.size)}</p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    className="text-xs tracking-[0.2em] text-zinc-600 hover:text-white uppercase transition-colors flex-shrink-0"
                  >
                    Copy URL
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}