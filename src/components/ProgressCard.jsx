import { useEffect, useState } from "react";

export default function ProgressCard({ progress, completed, total, sessions }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = displayed;
    const end = progress;
    if (start === end) return;
    const step = end > start ? 1 : -1;
    const t = setInterval(() => { start += step; setDisplayed(start); if (start === end) clearInterval(t); }, 12);
    return () => clearInterval(t);
  }, [progress]);

  const C = 2 * Math.PI * 52;
  const offset = C - (progress / 100) * C;

  return (
    <div className="rounded-3xl border border-white/10 p-5 h-full flex flex-col gap-5 transition-all duration-300 hover:border-purple-500/30 group relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs" style={{ background: "linear-gradient(135deg,#a855f7,#3b82f6)", boxShadow: "0 2px 8px rgba(168,85,247,0.3)" }}>📊</div>
        <span className="text-xs font-bold uppercase tracking-widest text-white/40">Today</span>
      </div>

      {/* Ring */}
      <div className="flex justify-center relative z-10">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#pg)" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}/>
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#3b82f6"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tighter">{displayed}<span className="text-lg font-medium text-white/40">%</span></span>
            <span className="text-[10px] text-white/30">complete</span>
          </div>
        </div>
      </div>

      {/* Bar */}
      <div className="relative z-10 space-y-1.5">
        <div className="flex justify-between text-[10px] text-white/30">
          <span>{completed} done</span><span>{total - completed} left</span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#a855f7,#3b82f6)", boxShadow: "0 0 6px rgba(168,85,247,0.4)" }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <MiniStat label="Done" value={completed} />
        <MiniStat label="Sessions" value={sessions} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-center">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}