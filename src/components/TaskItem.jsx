import { useState } from "react";
import { formatDate, isOverdue } from "../utils/date";

const PRIORITY = {
  high:   { label: "High",   cls: "text-red-400 bg-red-500/10 border-red-500/20" },
  medium: { label: "Mid",    cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  low:    { label: "Low",    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

const CATEGORY_COLORS = {
  Study:      "bg-purple-500/15 text-purple-300",
  Assignment: "bg-blue-500/15 text-blue-300",
  Personal:   "bg-pink-500/15 text-pink-300",
  Other:      "bg-gray-500/15 text-gray-300",
};

export default function TaskItem({ task, onToggle, onDelete, onUpdate, compact = false }) {
  const [hovered, setHovered] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 280);
  };

  const p = PRIORITY[task.priority] || PRIORITY.medium;
  const overdue = isOverdue(task.dueDate) && !task.done;
  const dateLabel = formatDate(task.dueDate);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-250 cursor-default
        ${removing ? "opacity-0 scale-95 translate-x-2" : "opacity-100"}
        ${task.done
          ? "bg-white/[0.015] border-white/5 opacity-50"
          : overdue
            ? "bg-red-500/5 border-red-500/15 hover:border-red-500/30"
            : "bg-gradient-to-r from-white/[0.05] to-white/[0.02] border-white/8 hover:border-purple-500/30 hover:from-purple-500/8 hover:to-blue-500/4 hover:scale-[1.005]"
        }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-250
          ${task.done ? "border-transparent" : overdue ? "border-red-400/50 hover:border-red-400" : "border-white/20 hover:border-purple-400"}`}
        style={task.done ? { background: "linear-gradient(135deg,#a855f7,#3b82f6)", boxShadow: "0 0 8px rgba(168,85,247,0.4)" } : {}}
      >
        {task.done && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Text */}
      <span className={`flex-1 text-sm font-medium transition-all duration-250 ${task.done ? "line-through text-white/25" : "text-white/80"}`}>
        {task.text}
      </span>

      {/* Meta */}
      {!compact && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.category && (
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Other}`}>
              {task.category}
            </span>
          )}
          {dateLabel && (
            <span className={`text-[10px] font-medium ${overdue ? "text-red-400" : "text-white/30"}`}>
              {dateLabel}
            </span>
          )}
        </div>
      )}

      {/* Priority badge */}
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex-shrink-0 ${p.cls}`}>
        {p.label}
      </span>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}