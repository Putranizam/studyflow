import {
  ClipboardList,
  CheckCheck,
  Timer,
  Flame,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { todayStr, isUpcoming, formatDate } from "../utils/date";
import ProgressCard from "./ProgressCard";
import TaskItem     from "./TaskItem";
import QuickAddTask from "./QuickAddTask";

// ─── stat card config ─────────────────────────────────────────────────────────
const STAT_CONFIG = [
  {
    key:     "tasks",
    label:   "Tasks today",
    icon:    ClipboardList,
    iconBg:  "bg-blue-500/15",
    iconClr: "text-blue-400",
    border:  "border-blue-500/10",
  },
  {
    key:     "completed",
    label:   "Completed",
    icon:    CheckCheck,
    iconBg:  "bg-emerald-500/15",
    iconClr: "text-emerald-400",
    border:  "border-emerald-500/10",
  },
  {
    key:     "focus",
    label:   "Focus time",
    icon:    Timer,
    iconBg:  "bg-violet-500/15",
    iconClr: "text-violet-400",
    border:  "border-violet-500/10",
  },
  {
    key:     "streak",
    label:   "Day streak",
    icon:    Flame,
    iconBg:  "bg-orange-500/15",
    iconClr: "text-orange-400",
    border:  "border-orange-500/10",
  },
];

const PRIORITY_DOT = {
  high:   "bg-red-400",
  medium: "bg-amber-400",
  low:    "bg-blue-400",
};

// ─── sub-components ───────────────────────────────────────────────────────────
function StatCard({ cfg, value }) {
  const Icon = cfg.icon;
  return (
    <div
      className={`
        rounded-2xl bg-zinc-900/50 backdrop-blur-sm
        border border-white/5 ${cfg.border}
        p-4 flex flex-col gap-3
        hover:bg-zinc-800/50 transition-all duration-200 cursor-default
      `}
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center ${cfg.iconBg} flex-shrink-0`}
      >
        <Icon size={16} className={cfg.iconClr} />
      </div>
      <div>
        <p className="text-xl font-bold text-white leading-none">{value}</p>
        <p className="text-[11px] text-zinc-500 font-medium mt-1">{cfg.label}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children, action, onAction }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
        {children}
      </span>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-violet-400 transition-colors"
        >
          {action} <ArrowRight size={11} />
        </button>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 py-8 text-center space-y-1.5">
      <p className="text-xl">🎉</p>
      <p className="text-sm font-medium text-zinc-400">All done for today!</p>
      <p className="text-xs text-zinc-600">Add more tasks or take a break.</p>
    </div>
  );
}

function UpcomingCard({ task, onToggle }) {
  const dot = PRIORITY_DOT[task.priority] || "bg-zinc-600";
  return (
    <div className="rounded-2xl bg-zinc-900/50 border border-white/5 p-3.5 space-y-2.5 hover:bg-zinc-800/50 hover:border-white/8 transition-all duration-200">
      <div className="flex items-start gap-2">
        <button
          onClick={() => onToggle(task.id)}
          className="w-4 h-4 mt-0.5 rounded-full border border-zinc-700 hover:border-violet-500 flex-shrink-0 transition-colors"
        />
        <p className="text-[13px] font-medium text-zinc-300 leading-snug line-clamp-2">
          {task.text}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span className="text-[11px] text-zinc-600">{formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function Dashboard({
  tasks, addTask, toggleTask, deleteTask,
  streak, todaySessions, todayTasks, overdueTasks, completedToday,
  setActiveNav,
}) {
  const upcomingTasks  = tasks.filter((t) => isUpcoming(t.dueDate) && !t.done).slice(0, 3);
  const todayPending   = todayTasks.filter((t) => !t.done);
  const todayDoneSlice = todayTasks.filter((t) => t.done).slice(0, 2);
  const progress       = todayTasks.length
    ? Math.round((todayTasks.filter((t) => t.done).length / todayTasks.length) * 100)
    : 0;

  const statValues = {
    tasks:     todayTasks.length,
    completed: completedToday.length,
    focus:     `${todaySessions.totalMinutes}m`,
    streak:    `${streak}d`,
  };

  return (
    <div className="w-full px-4 space-y-4">

      {/* ── Stat grid: 2 kolom × 2 baris di mobile, 4 kolom di desktop ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CONFIG.map((cfg) => (
          <StatCard key={cfg.key} cfg={cfg} value={statValues[cfg.key]} />
        ))}
      </div>

      {/* ── Overdue alert ── */}
      {overdueTasks.length > 0 && (
        <div className="w-full flex items-center gap-3 rounded-2xl bg-red-500/5 border border-red-500/15 px-4 py-3">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-400">
              {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-zinc-600 mt-0.5 truncate">
              {overdueTasks.slice(0, 2).map((t) => t.text).join(", ")}
              {overdueTasks.length > 2 ? ` +${overdueTasks.length - 2} more` : ""}
            </p>
          </div>
          <button
            onClick={() => setActiveNav("tasks")}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium transition-colors flex-shrink-0"
          >
            View <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* ── TODAY card: lebar penuh, chart di atas task list ── */}
      <div className="w-full">
        <ProgressCard
          progress={progress}
          completed={todayTasks.filter((t) => t.done).length}
          total={todayTasks.length}
          sessions={todaySessions.count}
        />
      </div>

      {/* ── Task section: lebar penuh, di bawah chart ── */}
      <div className="w-full flex flex-col gap-3">

        {/* Quick add */}
        <QuickAddTask onAdd={addTask} />

        {/* Today tasks */}
        <div className="w-full">
          <SectionLabel
            action={todayTasks.length > 6 ? `+${todayTasks.length - 6} more` : null}
            onAction={() => setActiveNav("tasks")}
          >
            Today · {todayPending.length} pending
          </SectionLabel>

          {todayPending.length === 0 && todayDoneSlice.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="w-full rounded-2xl bg-zinc-900/40 overflow-hidden">
              {todayPending.length === 0 ? (
                <EmptyState />
              ) : (
                todayPending.slice(0, 4).map((t, i) => (
                  <div key={t.id}>
                    <TaskItem task={t} onToggle={toggleTask} onDelete={deleteTask} compact />
                    {i < todayPending.slice(0, 4).length - 1 && (
                      <div className="h-px bg-zinc-800/50 mx-3" />
                    )}
                  </div>
                ))
              )}

              {/* Completed today */}
              {todayDoneSlice.length > 0 && (
                <>
                  {todayPending.length > 0 && <div className="h-px bg-zinc-800/50 mx-3" />}
                  {todayDoneSlice.map((t, i) => (
                    <div key={t.id}>
                      <TaskItem task={t} onToggle={toggleTask} onDelete={deleteTask} compact />
                      {i < todayDoneSlice.length - 1 && (
                        <div className="h-px bg-zinc-800/50 mx-3" />
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Upcoming: 1 kolom di mobile, 3 kolom di desktop ── */}
      {upcomingTasks.length > 0 && (
        <div className="w-full">
          <SectionLabel action="See all" onAction={() => setActiveNav("tasks")}>
            Upcoming
          </SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingTasks.map((t) => (
              <UpcomingCard key={t.id} task={t} onToggle={toggleTask} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}