import { useEffect, useState } from "react";
import { ListTodo, Brain } from "lucide-react";

export default function ProgressCard({ progress, completed, total, sessions }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = displayed;
    const end = progress;
    if (start === end) return;
    const step = end > start ? 1 : -1;
    const t = setInterval(() => {
      start += step;
      setDisplayed(start);
      if (start === end) clearInterval(t);
    }, 14);
    return () => clearInterval(t);
  }, [progress]);

  const R      = 48;
  const STROKE = 7;
  const C      = 2 * Math.PI * R;
  const offset = C - (progress / 100) * C;

  return (
    <div className="w-full rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-5">

      {/* Label row */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Today</span>
        <span className="text-[11px] text-zinc-600 font-medium">{total} tasks</span>
      </div>

      {/* ── Main body: ring kiri, info kanan ── */}
      <div className="flex items-center gap-5">

        {/* Ring — ukuran tetap, tidak stretch */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            {/* Track */}
            <circle
              cx="55" cy="55" r={R}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <circle
              cx="55" cy="55" r={R}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 0.65s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white tracking-tight leading-none">
              {displayed}
              <span className="text-sm font-normal text-zinc-500">%</span>
            </span>
            <span className="text-[10px] text-zinc-600 mt-0.5">done</span>
          </div>
        </div>

        {/* Right side: bar + mini stats */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-zinc-600">
              <span>{completed} completed</span>
              <span>{total - completed} left</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width:      `${progress}%`,
                  background: "linear-gradient(90deg,#8b5cf6,#3b82f6)",
                }}
              />
            </div>
          </div>

          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-2">
            <MiniStat icon={ListTodo} label="Done"     value={completed} />
            <MiniStat icon={Brain}    label="Sessions" value={sessions}  />
          </div>

        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-zinc-800/50 border border-white/5 p-2.5 flex items-center gap-2">
      <Icon size={14} className="text-zinc-500 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-white leading-none">{value}</p>
        <p className="text-[10px] text-zinc-600 mt-0.5">{label}</p>
      </div>
    </div>
  );
}