import { useMemo } from "react";
import {
  CheckCheck,
  CalendarCheck,
  TrendingUp,
  Timer,
  Flame,
  BarChart3,
  Tag,
} from "lucide-react";
import { todayStr, startOfWeek } from "../utils/date";

// ─── constants ────────────────────────────────────────────────────────────────
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const PRIORITY_CONFIG = [
  { key: "high",   label: "High",   bar: "bg-red-500",    bg: "bg-red-500/10",    text: "text-red-400"    },
  { key: "medium", label: "Medium", bar: "bg-amber-400",  bg: "bg-amber-400/10",  text: "text-amber-400"  },
  { key: "low",    label: "Low",    bar: "bg-blue-500",   bg: "bg-blue-500/10",   text: "text-blue-400"   },
];

const CATEGORY_CONFIG = {
  Study:      { color: "#8b5cf6", bg: "bg-violet-500/15 text-violet-400" },
  Assignment: { color: "#3b82f6", bg: "bg-blue-500/15 text-blue-400"    },
  Personal:   { color: "#ec4899", bg: "bg-pink-500/15 text-pink-400"    },
  Other:      { color: "#71717a", bg: "bg-zinc-500/15 text-zinc-400"    },
};

// ─── helper ───────────────────────────────────────────────────────────────────
const card = "rounded-2xl bg-zinc-900/50 backdrop-blur-sm p-4";

// ─── sub-components ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, label, value, sub }) {
  return (
    <div className={`${card} flex flex-col gap-3`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-zinc-500 mt-0.5 font-medium">{label}</p>
        {sub && <p className="text-[11px] text-zinc-700 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={14} className="text-zinc-600" />
      <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{children}</span>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────
export default function StatsPage({ tasks, todaySessions, streak }) {
  const stats = useMemo(() => {
    const today     = todayStr();
    const weekStart = startOfWeek();

    const completedToday = tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) === today).length;
    const completedWeek  = tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) >= weekStart).length;
    const totalTasks     = tasks.length;
    const totalDone      = tasks.filter((t) => t.done).length;
    const rate           = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0;

    // Last 7 days
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      return {
        label:   DAYS_SHORT[d.getDay()],
        date:    ds,
        count:   tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) === ds).length,
        isToday: ds === today,
      };
    });
    const maxCount = Math.max(...days.map((d) => d.count), 1);

    // Category
    const categories = {};
    tasks.filter((t) => t.done).forEach((t) => {
      const c = t.category || "Other";
      categories[c] = (categories[c] || 0) + 1;
    });

    // Priority
    const priorities = { high: 0, medium: 0, low: 0 };
    tasks.forEach((t) => {
      if (priorities[t.priority] !== undefined) priorities[t.priority]++;
    });

    return { completedToday, completedWeek, totalDone, totalTasks, rate, days, maxCount, categories, priorities };
  }, [tasks, todaySessions]);

  // Streak day dots aligned to current week (Mon–Sun)
  const today     = new Date();
  const weekDots  = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - today.getDay() + i); // Sun=0 … Sat=6
    const ds     = d.toISOString().slice(0, 10);
    const isFut  = ds > todayStr();
    const isDone = !isFut && tasks.some((t) => t.done && t.completedAt?.slice(0, 10) === ds);
    return { label: DAYS_SHORT[i], isDone, isToday: ds === todayStr(), isFut };
  });

  return (
    <div className="space-y-5 pb-4">

      {/* ── Row 1: 2×2 stat grid ── */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={CheckCheck}
          iconBg="bg-violet-600"
          label="Completed today"
          value={stats.completedToday}
          sub={`${stats.completedWeek} this week`}
        />
        <StatCard
          icon={CalendarCheck}
          iconBg="bg-blue-600"
          label="This week"
          value={stats.completedWeek}
          sub={`${stats.totalDone} all time`}
        />
        <StatCard
          icon={TrendingUp}
          iconBg="bg-emerald-600"
          label="Completion rate"
          value={`${stats.rate}%`}
          sub={`${stats.totalDone}/${stats.totalTasks} tasks`}
        />
        <StatCard
          icon={Timer}
          iconBg="bg-amber-600"
          label="Focus sessions"
          value={todaySessions.count}
          sub={`${todaySessions.totalMinutes} min today`}
        />
      </div>

      {/* ── Row 2: Streak + Bar chart side by side ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Streak card */}
        <div className={`${card} flex flex-col gap-3`}
          style={{ background: "linear-gradient(135deg, rgba(39,18,72,0.7), rgba(20,20,30,0.8))" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={16} className={streak > 0 ? "text-orange-400" : "text-zinc-600"} />
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Streak</span>
            </div>
            <span className="text-[11px] text-zinc-700">keep it going</span>
          </div>

          {/* Big number */}
          <div className="flex items-end gap-1.5">
            <span className="text-4xl font-bold text-white tracking-tight">{streak}</span>
            <span className="text-sm text-zinc-500 mb-1">days</span>
          </div>

          {/* Week dots Mon–Sun */}
          <div className="flex gap-1">
            {weekDots.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-6 rounded-lg transition-all duration-300 flex items-center justify-center ${
                  d.isFut
                    ? "bg-zinc-800/40"
                    : d.isDone
                      ? "bg-orange-500/30 border border-orange-500/40"
                      : "bg-zinc-800/60"
                }`}>
                  {d.isDone && <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                  {d.isToday && !d.isDone && <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />}
                </div>
                <span className={`text-[10px] font-medium ${
                  d.isToday ? "text-orange-400" : d.isFut ? "text-zinc-700" : "text-zinc-600"
                }`}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-day bar chart */}
        <div className={`${card} flex flex-col gap-3`}>
          <SectionTitle icon={BarChart3}>Last 7 days</SectionTitle>
          <div className="flex items-end gap-1.5 h-20">
            {stats.days.map((d) => {
              const pct  = Math.max((d.count / stats.maxCount) * 100, d.count ? 8 : 3);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  {d.count > 0 && (
                    <span className="text-[9px] text-zinc-600">{d.count}</span>
                  )}
                  <div className="w-full rounded-t-md transition-all duration-500 flex-1 flex items-end">
                    <div
                      className="w-full rounded-md transition-all duration-500"
                      style={{
                        height: `${pct}%`,
                        minHeight: "4px",
                        background: d.isToday
                          ? "linear-gradient(to top, #8b5cf6, #3b82f6)"
                          : d.count > 0
                            ? "rgba(139,92,246,0.4)"
                            : "rgba(255,255,255,0.05)",
                      }}
                    />
                  </div>
                  <span className={`text-[9px] font-medium ${d.isToday ? "text-violet-400" : "text-zinc-700"}`}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Priority + Category ── */}
      <div className="grid grid-cols-2 gap-3">

        {/* Priority breakdown */}
        <div className={card}>
          <SectionTitle icon={BarChart3}>By priority</SectionTitle>
          <div className="space-y-3">
            {PRIORITY_CONFIG.map(({ key, label, bar, bg, text }) => {
              const count = stats.priorities[key];
              const pct   = stats.totalTasks ? Math.round((count / stats.totalTasks) * 100) : 0;
              const empty = count === 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-medium ${empty ? "text-zinc-700" : text}`}>{label}</span>
                    </div>
                    <span className="text-[11px] text-zinc-700">{count}</span>
                  </div>
                  {/* Thick bar */}
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${empty ? "opacity-20" : ""} ${bar}`}
                      style={{ width: empty ? "100%" : `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-1 flex justify-between text-[11px]">
              <span className="text-zinc-700">Total</span>
              <span className="text-zinc-500 font-medium">{stats.totalTasks}</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={card}>
          <SectionTitle icon={Tag}>By category</SectionTitle>
          {Object.keys(stats.categories).length === 0 ? (
            <div className="flex items-center justify-center h-24">
              <p className="text-xs text-zinc-700">No completed tasks yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.categories).map(([cat, count]) => {
                const pct = stats.totalDone ? Math.round((count / stats.totalDone) * 100) : 0;
                const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.Other;
                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${cfg.bg}`}>
                        {cat}
                      </span>
                      <span className="text-[11px] text-zinc-700">{count} · {pct}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${Math.max(pct, 4)}%`, background: cfg.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}