import { useState } from "react";

const PRIORITY = {
  high: { label: "High", color: "text-red-400 bg-red-500/10 border-red-500/20" },
  medium: { label: "Mid", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  low: { label: "Low", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export default function TaskList({ tasks, onToggle, onDelete }) {
  const [removing, setRemoving] = useState(null);

  const handleDelete = (id) => {
    setRemoving(id);
    setTimeout(() => {
      onDelete(id);
      setRemoving(null);
    }, 300);
  };

  const pending = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);

  return (
    <div className="space-y-4">
      {/* Pending */}
      {pending.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-1">
            Pending · {pending.length}
          </p>
          {pending.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={handleDelete}
              isRemoving={removing === task.id}
            />
          ))}
        </div>
      )}

      {/* Completed */}
      {done.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/20 px-1">
            Completed · {done.length}
          </p>
          {done.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={handleDelete}
              isRemoving={removing === task.id}
            />
          ))}
        </div>
      )}

      {tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
          <p className="text-3xl mb-2">🎉</p>
          <p className="text-white/40 text-sm">All clear! Add a new task above.</p>
        </div>
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, isRemoving }) {
  const [hovered, setHovered] = useState(false);
  const p = PRIORITY[task.priority] || PRIORITY.medium;

  return (
    <div
      className={`group relative flex items-center gap-3 rounded-2xl border px-4 py-3.5
        transition-all duration-300 cursor-default
        ${isRemoving ? "opacity-0 scale-95 translate-x-4" : "opacity-100 scale-100"}
        ${task.done
          ? "bg-white/[0.02] border-white/5 opacity-50"
          : "bg-gradient-to-r from-white/[0.05] to-white/[0.02] border-white/10 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/5 hover:shadow-lg hover:shadow-purple-500/5 hover:scale-[1.01]"
        }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          transition-all duration-300
          ${task.done
            ? "border-transparent bg-gradient-to-br from-purple-500 to-blue-500 shadow-sm shadow-purple-500/50"
            : "border-white/20 hover:border-purple-400 hover:shadow-sm hover:shadow-purple-400/30"
          }`}
        aria-label={task.done ? "Mark incomplete" : "Mark complete"}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Text */}
      <span
        className={`flex-1 text-sm font-medium transition-all duration-300
          ${task.done ? "line-through text-white/30" : "text-white/80"}`}
      >
        {task.task || task.text}
      </span>

      {/* Priority badge */}
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider flex-shrink-0 ${p.color}`}>
        {p.label}
      </span>

      {/* Delete button */}
      <button
        onClick={() => onDelete(task.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-500/10
          transition-all duration-150
          ${hovered ? "opacity-100" : "opacity-0"}`}
        aria-label="Delete task"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}