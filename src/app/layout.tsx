import "./globals.css";
import WruShell from "./components/Wrushell";
import MusicPlayer from "./components/MusicPill"; // เปลี่ยนชื่อให้ตรงกับไฟล์ที่คุณมีในโฟลเดอร์ components

export const metadata = {
  title: "WRU",
  description: "Where are you",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <WruShell>
          {children}
        </WruShell>
        {/* วางไว้ตรงนี้เพื่อให้เพลงเล่นต่อเนื่องทุกหน้าโดยไม่โดน Reset */}
        <MusicPlayer />
      </body>
    </html>
  );
}