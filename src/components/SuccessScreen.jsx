import { useEffect, useState } from "react";
import AuthLayout from "./AuthLayout";

// ─── Duration in ms ───────────────────────────────────────────────────────────
const DURATION = 1800;

// ─── SuccessScreen ────────────────────────────────────────────────────────────
// Drop-in replacement for the success block inside Register.jsx.
// Usage: swap the inline success JSX with <SuccessScreen onDone={() => setPage("login")} />
//
// If framer-motion is available it uses motion.div for the fade-scale entry.
// Otherwise it falls back to a pure CSS @keyframes approach — no hard dependency.

export default function SuccessScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [visible,  setVisible]  = useState(false);

  // Trigger CSS fade-scale on mount
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Smooth progress from 0 → 100 over DURATION ms
  useEffect(() => {
    const start  = performance.now();
    let raf;

    function tick(now) {
      const elapsed = now - start;
      const pct     = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onDone, 120);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AuthLayout>
      {/*
        CSS fade-scale animation.
        If you have framer-motion, replace this div with:
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
      */}
      <div
        style={{
          opacity:    visible ? 1 : 0,
          transform:  visible ? "scale(1)" : "scale(0.92)",
          transition: "opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="text-center py-6 space-y-5">

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,rgba(168,85,247,0.15),rgba(59,130,246,0.15))",
              border:     "1px solid rgba(168,85,247,0.25)",
            }}
          >
            {/* Checkmark SVG — no external dep */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="13" stroke="url(#cg)" strokeWidth="1.5" />
              <path
                d="M8.5 14.5l4 4 7-8"
                stroke="url(#cg)" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Copy */}
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-white tracking-tight">Account created!</h2>
            <p className="text-sm text-zinc-500">Redirecting you to login…</p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 px-2">
            {/* Track */}
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              {/* Fill */}
              <div
                className="h-full rounded-full"
                style={{
                  width:      `${progress}%`,
                  background: "linear-gradient(90deg,#a855f7,#3b82f6)",
                  boxShadow:  "0 0 10px rgba(139,92,246,0.55)",
                  transition: "width 40ms linear",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </AuthLayout>
  );
}