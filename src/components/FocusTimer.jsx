import { useState, useEffect, useRef } from "react";

const MODES = [
  { id: "focus",  label: "Focus",       secs: 25 * 60, color: "from-purple-600 to-blue-600" },
  { id: "short",  label: "Short Break", secs: 5 * 60,  color: "from-emerald-600 to-teal-600" },
  { id: "long",   label: "Long Break",  secs: 15 * 60, color: "from-orange-500 to-pink-600" },
];

function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;
}

export default function FocusTimer({ todaySessions, onSessionComplete }) {
  const [mode, setMode] = useState(MODES[0]);
  const [secs, setSecs] = useState(MODES[0].secs);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          setRunning(false);
          if (mode.id === "focus") onSessionComplete(Math.round(mode.secs / 60));
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, mode]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchMode = (m) => { setMode(m); setSecs(m.secs); setRunning(false); };
  const toggle = () => setRunning((r) => !r);
  const reset = () => { setSecs(mode.secs); setRunning(false); };

  const progress = 1 - secs / mode.secs;

  return (
    <div className="relative" ref={panelRef}>
      {/* Pill */}
      <button onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-2.5 px-4 py-2 rounded-full border transition-all duration-200 hover:scale-[1.02]
          ${running ? `bg-gradient-to-r ${mode.color} border-transparent text-white` : "bg-white/5 border-white/10 hover:border-white/20"}`}
        style={running ? { boxShadow: "0 0 16px rgba(139,92,246,0.4)" } : {}}>
        {running && <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white pointer-events-none" />}
        <span className="text-sm">{running ? "⏱" : "⏰"}</span>
        <span className="text-sm font-mono font-bold">{fmt(secs)}</span>
        <span className={`text-xs hidden sm:block ${running ? "text-white/80" : "text-white/30"}`}>{mode.label}</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-white/10 p-5 space-y-4"
          style={{ background: "rgba(12,12,22,0.97)", backdropFilter: "blur(24px)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>

          {/* Mode tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {MODES.map((m) => (
              <button key={m.id} onClick={() => switchMode(m)}
                className={`flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all duration-200
                  ${mode.id === m.id ? `bg-gradient-to-r ${m.color} text-white` : "text-white/30 hover:text-white/60"}`}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Big time display */}
          <div className="text-center py-2 relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="2"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="url(#tg2)" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*45}`} strokeDashoffset={`${2*Math.PI*45*(1-progress)}`}
                  transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 1s linear" }}/>
                <defs>
                  <linearGradient id="tg2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7"/><stop offset="100%" stopColor="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={`relative text-5xl font-black font-mono tracking-tighter ${running ? "text-white" : "text-white/80"}`}
              style={running ? { textShadow: "0 0 30px rgba(168,85,247,0.5)" } : {}}>
              {fmt(secs)}
            </span>
            {running && <p className="text-xs text-white/30 mt-1 animate-pulse">Focusing…</p>}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button onClick={toggle}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-95 bg-gradient-to-r ${mode.color}`}
              style={{ boxShadow: "0 4px 14px rgba(124,58,237,0.4)" }}>
              {running ? "⏸ Pause" : "▶ Start"}
            </button>
            <button onClick={reset} className="w-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 text-lg transition-all">↺</button>
          </div>

          {/* Today stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <p className="text-xl font-bold">{todaySessions.count}</p>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">Sessions</p>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <p className="text-xl font-bold">{todaySessions.totalMinutes}m</p>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mt-0.5">Focus time</p>
            </div>
          </div>

          {/* Session dots */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-white/25">Sessions today</span>
            <div className="flex gap-1.5">
              {[...Array(Math.max(4, todaySessions.count))].slice(0, 8).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all"
                  style={i < todaySessions.count ? { background: "#a855f7", boxShadow: "0 0 4px rgba(168,85,247,0.6)" } : { background: "rgba(255,255,255,0.1)" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}