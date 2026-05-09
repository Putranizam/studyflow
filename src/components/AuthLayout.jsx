export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 relative overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-700/12 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-700/10 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-800/8 blur-[80px]" />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg"
            style={{
              background: "linear-gradient(135deg,#a855f7,#3b82f6)",
              boxShadow: "0 4px 20px rgba(168,85,247,0.4)",
            }}
          >
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">StudyFlow</span>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/10 p-8"
          style={{
            background: "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}