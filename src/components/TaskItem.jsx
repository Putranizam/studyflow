import { useState } from "react";
import { X } from "lucide-react";
import { formatDate, isOverdue } from "../utils/date";

const PRIORITY_DOT = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-emerald-400",
};

const CATEGORY_COLORS = {
  Study:      "text-violet-400",
  Assignment: "text-blue-400",
  Personal:   "text-pink-400",
  Other:      "text-zinc-400",
};

export default function TaskItem({ task, onToggle, onDelete, compact = false }) {
  const [hovered,  setHovered]  = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 250);
  };

  const overdue    = isOverdue(task.dueDate) && !task.done;
  const dateLabel  = formatDate(task.dueDate);
  const dot        = PRIORITY_DOT[task.priority] || PRIORITY_DOT.medium;
  const catColor   = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Other;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        removing
          ? "opacity-0 scale-95"
          : task.done
            ? "opacity-40"
            : overdue
              ? "bg-red-500/5 hover:bg-red-500/10"
              : "hover:bg-zinc-800/60"
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-[18px] h-[18px] rounded-full border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          task.done
            ? "border-transparent bg-violet-600"
            : overdue
              ? "border-red-500/50 hover:border-red-400"
              : "border-zinc-700 hover:border-violet-500"
        }`}
      >
        {task.done && (
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Text */}
      <span className={`flex-1 text-sm transition-all duration-200 min-w-0 truncate ${
        task.done ? "line-through text-zinc-600" : "text-zinc-200"
      }`}>
        {task.text}
      </span>

      {/* Meta — hidden on compact */}
      {!compact && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Category */}
          {task.category && (
            <span className={`text-[11px] font-medium ${catColor} hidden sm:block`}>
              {task.category}
            </span>
          )}

          {/* Due date */}
          {dateLabel && (
            <span className={`text-[11px] font-medium ${overdue ? "text-red-400" : "text-zinc-600"}`}>
              {dateLabel}
            </span>
          )}

          {/* Priority dot */}
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`} />
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
      >
        <X size={13} />
      </button>
    </div>
  );
}