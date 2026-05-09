import { useState } from "react";
import { todayStr } from "../utils/date";

const CATEGORIES = ["Study", "Assignment", "Personal", "Other"];

export default function QuickAddTask({ onAdd, showFull = false }) {
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Study");
  const [dueDate, setDueDate] = useState(todayStr());
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), priority, category, dueDate: dueDate || todayStr() });
    setText("");
    setFlash(true);
    setTimeout(() => setFlash(false), 300);
  };

  const handleKey = (e) => { if (e.key === "Enter") handleAdd(); };

  const expanded = focused || showFull;

  return (
    <div className={`rounded-2xl border transition-all duration-300 p-4 space-y-3
      ${flash ? "scale-[1.01]" : "scale-100"}
      ${focused ? "border-purple-500/50 bg-purple-900/10" : "border-white/10 bg-white/[0.04]"}`}
      style={focused ? { boxShadow: "0 0 20px rgba(139,92,246,0.12)" } : {}}>

      {/* Input row */}
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300
          ${focused ? "" : "bg-white/10"}`}
          style={focused ? { background: "linear-gradient(135deg,#a855f7,#3b82f6)", boxShadow: "0 2px 12px rgba(168,85,247,0.4)" } : {}}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKey}
          placeholder="Add a new task…"
          className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
        />
        <button onClick={handleAdd} disabled={!text.trim()}
          className={`flex-shrink-0 px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200
            ${text.trim() ? "text-white hover:scale-105 active:scale-95" : "bg-white/5 text-white/20 cursor-not-allowed"}`}
          style={text.trim() ? { background: "linear-gradient(135deg,#7c3aed,#2563eb)", boxShadow: "0 2px 10px rgba(124,58,237,0.35)" } : {}}>
          Add
        </button>
      </div>

      {/* Expanded options */}
      <div className={`grid grid-cols-3 gap-2 transition-all duration-300 overflow-hidden ${expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
        {/* Priority */}
        <div className="space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Priority</p>
          <div className="flex gap-1">
            {["high","medium","low"].map((p) => (
              <button key={p} onClick={() => setPriority(p)}
                className={`flex-1 text-[10px] py-1 rounded-lg border capitalize font-semibold transition-all
                  ${priority === p ? p === "high" ? "bg-red-500/20 border-red-500/30 text-red-400" : p === "medium" ? "bg-amber-500/20 border-amber-500/30 text-amber-400" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : "border-white/10 text-white/30 hover:text-white/60"}`}>
                {p.slice(0,3)}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Category</p>
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/70 outline-none cursor-pointer">
            {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
          </select>
        </div>

        {/* Due date */}
        <div className="space-y-1">
          <p className="text-[10px] text-white/30 uppercase tracking-widest">Due Date</p>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            min={todayStr()}
            className="w-full text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/70 outline-none cursor-pointer"
            style={{ colorScheme: "dark" }}
          />
        </div>
      </div>
    </div>
  );
}