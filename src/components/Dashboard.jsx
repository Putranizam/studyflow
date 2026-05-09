import { todayStr, isUpcoming } from "../utils/date";
import ProgressCard from "./ProgressCard";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickAddTask";

export default function Dashboard({ tasks, addTask, toggleTask, deleteTask, streak, todaySessions, todayTasks, overdueTasks, completedToday, setActiveNav }) {
  const upcomingTasks = tasks.filter((t) => isUpcoming(t.dueDate) && !t.done).slice(0, 3);
  const todayPending = todayTasks.filter((t) => !t.done);
  const progress = todayTasks.length ? Math.round((todayTasks.filter(t => t.done).length / todayTasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary stat chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Tasks Today" value={todayTasks.length} icon="📋" color="purple" />
        <StatCard label="Completed" value={completedToday.length} icon="✅" color="green" />
        <StatCard label="Focus Time" value={`${todaySessions.totalMinutes}m`} icon="⏱" color="blue" />
        <StatCard label="Streak" value={`${streak}d 🔥`} icon="🔥" color="orange" />
      </div>

      {/* Overdue alert */}
      {overdueTasks.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">{overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}</p>
            <p className="text-xs text-white/40 mt-0.5">These tasks are past their due date</p>
          </div>
          <button onClick={() => setActiveNav("tasks")} className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors">View →</button>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <ProgressCard progress={progress} completed={todayTasks.filter(t => t.done).length} total={todayTasks.length} sessions={todaySessions.count} />
        </div>

        <div className="col-span-1 md:col-span-2 space-y-4">
          <QuickAddTask onAdd={addTask} />

          {/* Today's tasks */}
          <Section title={`Today · ${todayPending.length} pending`}>
            {todayPending.length === 0 ? (
              <EmptyState icon="🎉" text="All done for today!" />
            ) : (
              todayPending.slice(0, 4).map((t) => (
                <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} compact />
              ))
            )}
            {todayTasks.filter(t => t.done).slice(0, 2).map((t) => (
              <TaskItem key={t.id} task={t} onToggle={toggleTask} onDelete={deleteTask} compact />
            ))}
            {todayTasks.length > 6 && (
              <button onClick={() => setActiveNav("tasks")} className="w-full text-xs text-white/30 hover:text-purple-400 py-2 transition-colors">
                +{todayTasks.length - 6} more tasks →
              </button>
            )}
          </Section>
        </div>
      </div>

      {/* Upcoming */}
      {upcomingTasks.length > 0 && (
        <Section title="Upcoming">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {upcomingTasks.map((t) => (
              <UpcomingCard key={t.id} task={t} onToggle={toggleTask} />
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    purple: "from-purple-500/15 to-purple-600/5 border-purple-500/20",
    green:  "from-emerald-500/15 to-emerald-600/5 border-emerald-500/20",
    blue:   "from-blue-500/15 to-blue-600/5 border-blue-500/20",
    orange: "from-orange-500/15 to-orange-600/5 border-orange-500/20",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${colors[color]} p-4 flex items-center gap-3 transition-all duration-200 hover:scale-[1.02] cursor-default`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs text-white/35 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-white/30 px-1">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmptyState({ icon, text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="text-sm text-white/30">{text}</p>
    </div>
  );
}

function UpcomingCard({ task, onToggle }) {
  const { formatDate } = { formatDate: (d) => { if (!d) return null; const date = new Date(d + "T00:00:00"); const today = new Date(); today.setHours(0,0,0,0); const diff = Math.round((date - today) / 86400000); if (diff === 0) return "Today"; if (diff === 1) return "Tomorrow"; if (diff <= 7) return `In ${diff}d`; return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }); } };
  const PRIORITY_COLOR = { high: "text-red-400", medium: "text-amber-400", low: "text-emerald-400" };
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 space-y-2 hover:border-purple-500/25 transition-all duration-200">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-white/80 leading-tight">{task.text}</p>
        <button onClick={() => onToggle(task.id)} className="w-5 h-5 rounded-full border border-white/20 hover:border-purple-400 flex-shrink-0 mt-0.5 transition-colors" />
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${PRIORITY_COLOR[task.priority]}`}>{task.priority}</span>
        <span className="text-xs text-white/25">·</span>
        <span className="text-xs text-white/35">{formatDate(task.dueDate)}</span>
      </div>
    </div>
  );
}