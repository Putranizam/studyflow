import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { todayStr } from "../utils/date";

const CATEGORIES = ["Study", "Assignment", "Personal", "Other"];

const PRIORITY_CONFIG = {
  high:   { label: "High",   dot: "bg-red-400" },
  medium: { label: "Medium", dot: "bg-amber-400" },
  low:    { label: "Low",    dot: "bg-emerald-400" },
};

export default function QuickAddTask({ onAdd, showFull = false }) {
  const [text, setText]         = useState("");
  const [focused, setFocused]   = useState(false);
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Study");
  const [dueDate, setDueDate]   = useState(todayStr());

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd({ text: text.trim(), priority, category, dueDate: dueDate || todayStr() });
    setText("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const expanded = focused || showFull;

  return (
    <div className={`rounded-2xl transition-all duration-200 ${
      focused ? "bg-zinc-900 ring-1 ring-violet-500/40" : "bg-zinc-900/60"
    }`}>
      {/* ── Main input row ── */}
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={handleAdd}
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
            text.trim()
              ? "bg-violet-600 hover:bg-violet-500 text-white"
              : "bg-zinc-800 text-zinc-600"
          }`}
        >
          <Plus size={15} />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKey}
          placeholder="Add a task…"
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none"
        />

        {text.trim() && (
          <span className="text-[11px] text-zinc-600 flex-shrink-0">↵ enter</span>
        )}
      </div>

      {/* ── Expanded meta row ── */}
      {expanded && (
        <div className="flex items-center gap-1 px-4 pb-3 border-t border-zinc-800/60 pt-2.5 flex-wrap">
          {/* Priority pills */}
          {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setPriority(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
                priority === key
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          ))}

          <div className="w-px h-4 bg-zinc-800 mx-1" />

          {/* Category select */}
          <div className="relative flex items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none bg-transparent text-xs text-zinc-400 outline-none cursor-pointer pr-4 hover:text-zinc-200 transition-colors"
              style={{ colorScheme: "dark" }}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-zinc-900">{c}</option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-0 text-zinc-600 pointer-events-none" />
          </div>

          <div className="w-px h-4 bg-zinc-800 mx-1" />

          {/* Due date */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={todayStr()}
            className="text-xs text-zinc-400 bg-transparent outline-none cursor-pointer hover:text-zinc-200 transition-colors"
            style={{ colorScheme: "dark" }}
          />
        </div>
      )}
    </div>
  );
}