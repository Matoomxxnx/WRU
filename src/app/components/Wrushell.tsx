export default function WruShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wru-noise" />
      <main className="neo-container">{children}</main>
    </>
  );
}