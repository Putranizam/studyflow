import { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { isToday, isOverdue, isUpcoming } from "../utils/date";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickAddTask";

const STATUS_FILTERS = ["All", "Today", "Upcoming", "Overdue", "Completed"];
const PRIORITY_FILTERS = ["All", "High", "Medium", "Low"];
const CATEGORY_FILTERS = ["All", "Study", "Assignment", "Personal", "Other"];
const SORTS = ["Due Date", "Priority", "Created"];
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function TasksPage({ tasks, addTask, toggleTask, deleteTask }) {
  const [status,   setStatus]   = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort,     setSort]     = useState("Due Date");
  const [showSub,  setShowSub]  = useState(false);

  const filtered = useMemo(() => {
    let list = [...tasks];

    if (status === "Today")     list = list.filter((t) => isToday(t.dueDate));
    if (status === "Upcoming")  list = list.filter((t) => isUpcoming(t.dueDate) && !t.done);
    if (status === "Overdue")   list = list.filter((t) => isOverdue(t.dueDate) && !t.done);
    if (status === "Completed") list = list.filter((t) => t.done);
    if (priority !== "All")     list = list.filter((t) => t.priority === priority.toLowerCase());
    if (category !== "All")     list = list.filter((t) => t.category === category);

    if (sort === "Priority") list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sort === "Due Date") list.sort((a, b) => (a.dueDate || "9999") < (b.dueDate || "9999") ? -1 : 1);
    if (sort === "Created")  list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [tasks, status, priority, category, sort]);

  const overdue   = filtered.filter((t) => isOverdue(t.dueDate) && !t.done);
  const pending   = filtered.filter((t) => !t.done && !isOverdue(t.dueDate));
  const completed = filtered.filter((t) => t.done);

  const hasSubFilter = priority !== "All" || category !== "All";

  return (
    <div className="space-y-6">

      {/* ── Quick add ── */}
      <QuickAddTask onAdd={addTask} showFull />

      {/* ── Filter bar ── */}
      <div className="space-y-3">

        {/* Row 1: status tabs + sort + sub-filter toggle */}
        <div className="flex items-center gap-2">
          {/* Status — horizontal scroll on mobile */}
          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-1 w-max">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setStatus(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    status === f
                      ? "bg-violet-600 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ArrowUpDown size={13} className="text-zinc-600" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs text-zinc-400 bg-transparent outline-none cursor-pointer hover:text-zinc-200 transition-colors"
              style={{ colorScheme: "dark" }}
            >
              {SORTS.map((s) => (
                <option key={s} value={s} className="bg-zinc-900">{s}</option>
              ))}
            </select>
          </div>

          {/* Sub-filter toggle */}
          <button
            onClick={() => setShowSub((v) => !v)}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-all duration-150 ${
              hasSubFilter || showSub
                ? "bg-violet-600/20 text-violet-400"
                : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60"
            }`}
            title="More filters"
          >
            <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* Row 2: priority + category (collapsible) */}
        {showSub && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {/* Priority */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[11px] text-zinc-600 mr-1">Priority</span>
              {PRIORITY_FILTERS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    priority === p
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="w-px bg-zinc-800 flex-shrink-0" />

            {/* Category */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="text-[11px] text-zinc-600 mr-1">Category</span>
              {CATEGORY_FILTERS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
                    category === c
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Task count ── */}
      <p className="text-xs text-zinc-600">
        {filtered.length} task{filtered.length !== 1 ? "s" : ""}
        {(priority !== "All" || category !== "All" || status !== "All") && (
          <button
            onClick={() => { setStatus("All"); setPriority("All"); setCategory("All"); }}
            className="ml-2 text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </p>

      {/* ── Task sections ── */}
      <div className="space-y-6">
        {overdue.length > 0 && (
          <TaskSection
            title="Overdue"
            count={overdue.length}
            titleCls="text-red-400"
            tasks={overdue}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}

        {pending.length > 0 && (
          <TaskSection
            title="Pending"
            count={pending.length}
            tasks={pending}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}

        {completed.length > 0 && (
          <TaskSection
            title="Completed"
            count={completed.length}
            tasks={completed}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}

        {filtered.length === 0 && (
          <div className="py-16 text-center space-y-2">
            <p className="text-3xl">📭</p>
            <p className="text-sm text-zinc-600">No tasks match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Task section ─────────────────────────────────────────────────────────────
function TaskSection({ title, count, titleCls = "text-zinc-600", tasks, onToggle, onDelete }) {
  return (
    <div className="space-y-0.5">
      {/* Section header */}
      <div className="flex items-center gap-2 px-3 mb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${titleCls}`}>
          {title}
        </span>
        <span className="text-[11px] text-zinc-700 font-medium">{count}</span>
      </div>

      {/* Items — grouped in a subtle container */}
      <div className="rounded-2xl bg-zinc-900/40 overflow-hidden">
        {tasks.map((t, i) => (
          <div key={t.id}>
            <TaskItem task={t} onToggle={onToggle} onDelete={onDelete} />
            {i < tasks.length - 1 && (
              <div className="h-px bg-zinc-800/50 mx-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}