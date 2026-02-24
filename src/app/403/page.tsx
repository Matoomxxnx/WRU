export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">403</h1>
        <p className="text-white/60">You don&apos;t have permission to access this page.</p>
      </div>
    </div>
  );
}