import { useMemo } from "react";
import { todayStr, startOfWeek } from "../utils/date";

export default function StatsPage({ tasks, todaySessions, streak }) {
  const stats = useMemo(() => {
    const today = todayStr();
    const weekStart = startOfWeek();

    const completedToday = tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) === today).length;
    const completedWeek  = tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) >= weekStart).length;
    const totalTasks     = tasks.length;
    const totalDone      = tasks.filter((t) => t.done).length;
    const rate           = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

    // Last 7 days chart
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      return {
        label: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: ds,
        count: tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) === ds).length,
        isToday: ds === today,
      };
    });

    const maxCount = Math.max(...days.map((d) => d.count), 1);

    // Category breakdown
    const categories = {};
    tasks.filter((t) => t.done).forEach((t) => {
      const c = t.category || "Other";
      categories[c] = (categories[c] || 0) + 1;
    });

    // Priority breakdown
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => { if (priorities[t.priority] !== undefined) priorities[t.priority]++; });

    return { completedToday, completedWeek, totalDone, totalTasks, rate, days, maxCount, categories, priorities };
  }, [tasks, todaySessions]);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <BigStat label="Completed today" value={stats.completedToday} icon="✅" />
        <BigStat label="Completed this week" value={stats.completedWeek} icon="📅" />
        <BigStat label="Completion rate" value={`${stats.rate}%`} icon="📈" />
        <BigStat label="Focus sessions" value={todaySessions.count} icon="⏱" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Weekly chart */}
        <div className="col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6 space-y-4 overflow-x-hidden">
          <h3 className="text-sm font-semibold text-white/60">Tasks completed — last 7 days</h3>
          <div className="flex items-end gap-3 h-32">
            {stats.days.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-white/40">{d.count || ""}</span>
                <div className="w-full rounded-t-lg transition-all duration-500 relative overflow-hidden"
                  style={{ height: `${Math.max((d.count / stats.maxCount) * 96, d.count ? 8 : 4)}px`,
                    background: d.isToday ? "linear-gradient(to top,#a855f7,#3b82f6)" : d.count > 0 ? "rgba(168,85,247,0.35)" : "rgba(255,255,255,0.06)",
                    boxShadow: d.isToday ? "0 0 12px rgba(168,85,247,0.4)" : "none" }}>
                </div>
                <span className={`text-[10px] font-medium ${d.isToday ? "text-purple-400" : "text-white/30"}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Streak card */}
        <div className="col-span-1 rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6 flex flex-col items-center justify-center gap-3 text-center">
          <div className="text-5xl">{streak > 0 ? "🔥" : "💤"}</div>
          <div>
            <p className="text-4xl font-black">{streak}</p>
            <p className="text-xs text-white/30 uppercase tracking-widest mt-1">Day streak</p>
          </div>
          <p className="text-xs text-white/20">Complete at least 1 task per day to keep your streak alive</p>
          <div className="flex gap-1.5">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full transition-all"
                style={i < Math.min(streak, 7)
                  ? { background: "linear-gradient(135deg,#f59e0b,#ef4444)", boxShadow: "0 0 6px rgba(245,158,11,0.5)" }
                  : { background: "rgba(255,255,255,0.08)" }} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category breakdown */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60">Completed by category</h3>
          {Object.keys(stats.categories).length === 0
            ? <p className="text-xs text-white/25 text-center py-4">No completed tasks yet</p>
            : Object.entries(stats.categories).map(([cat, count]) => {
              const pct = stats.totalDone ? Math.round((count / stats.totalDone) * 100) : 0;
              const colors = { Study: "#a855f7", Assignment: "#3b82f6", Personal: "#ec4899", Other: "#6b7280" };
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">{cat}</span>
                    <span className="text-white/40">{count} · {pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: colors[cat] || "#6b7280" }} />
                  </div>
                </div>
              );
          })}
        </div>

        {/* Priority breakdown */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 md:p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white/60">Tasks by priority</h3>
          {[
            { key: "high",   label: "High",   color: "#ef4444" },
            { key: "medium", label: "Medium", color: "#f59e0b" },
            { key: "low",    label: "Low",    color: "#10b981" },
          ].map(({ key, label, color }) => {
            const count = stats.priorities[key];
            const pct = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{label}</span>
                  <span className="text-white/40">{count} tasks · {pct}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
          <div className="pt-3 border-t border-white/5 flex justify-between text-xs">
            <span className="text-white/30">Total tasks</span>
            <span className="font-bold">{stats.totalTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigStat({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-purple-500/25 transition-all duration-200 hover:scale-[1.02] cursor-default">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-black mt-2">{value}</p>
      <p className="text-xs text-white/35 mt-1">{label}</p>
    </div>
  );
}