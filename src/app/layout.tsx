import "./globals.css";
import WruShell from "./components/Wrushell";

export const metadata = {
  title: "WRU",
  description: "Where are you",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>
        <WruShell>{children}</WruShell>
      </body>
    </html>
  );
}