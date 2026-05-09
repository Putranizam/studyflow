import { useState, useMemo } from "react";
import { isToday, isOverdue, isUpcoming } from "../utils/date";
import TaskItem from "./TaskItem";
import QuickAddTask from "./QuickAddTask";

const FILTERS = ["All", "Today", "Upcoming", "Overdue", "Completed"];
const PRIORITIES = ["All", "High", "Medium", "Low"];
const SORTS = ["Due Date", "Priority", "Created"];
const CATEGORIES = ["All", "Study", "Assignment", "Personal", "Other"];

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function TasksPage({ tasks, addTask, toggleTask, deleteTask, updateTask }) {
  const [filter, setFilter] = useState("All");
  const [priority, setPriority] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Due Date");

  const filtered = useMemo(() => {
    let list = [...tasks];

    // Status filter
    if (filter === "Today")     list = list.filter((t) => isToday(t.dueDate));
    if (filter === "Upcoming")  list = list.filter((t) => isUpcoming(t.dueDate) && !t.done);
    if (filter === "Overdue")   list = list.filter((t) => isOverdue(t.dueDate) && !t.done);
    if (filter === "Completed") list = list.filter((t) => t.done);

    // Priority filter
    if (priority !== "All") list = list.filter((t) => t.priority === priority.toLowerCase());

    // Category filter
    if (category !== "All") list = list.filter((t) => t.category === category);

    // Sort
    if (sort === "Priority")   list.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    if (sort === "Due Date")   list.sort((a, b) => (a.dueDate || "9999") < (b.dueDate || "9999") ? -1 : 1);
    if (sort === "Created")    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return list;
  }, [tasks, filter, priority, category, sort]);

  const overdue   = filtered.filter((t) => isOverdue(t.dueDate) && !t.done);
  const pending   = filtered.filter((t) => !t.done && !isOverdue(t.dueDate));
  const completed = filtered.filter((t) => t.done);

  return (
    <div className="space-y-5">
      <QuickAddTask onAdd={addTask} showFull />

      {/* Filter bar */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 md:p-6 space-y-3">
        {/* Status tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-full md:w-fit overflow-x-auto">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all duration-150 whitespace-nowrap
                ${filter === f ? "text-white" : "text-white/35 hover:text-white/60"}`}
              style={filter === f ? { background: "linear-gradient(135deg,#7c3aed,#2563eb)" } : {}}>
              {f}
            </button>
          ))}
        </div>

        {/* Secondary filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <FilterGroup label="Priority" options={PRIORITIES} value={priority} onChange={setPriority} />
          <FilterGroup label="Category" options={CATEGORIES} value={category} onChange={setCategory} />
          <div className="w-full md:w-auto mt-2 md:mt-0 ml-0 md:ml-auto flex items-center gap-2">
            <span className="text-xs md:text-sm text-white/30">Sort:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-auto text-xs md:text-sm bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/60 outline-none cursor-pointer">
              {SORTS.map((s) => <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Task count */}
      <p className="text-xs text-white/30 px-1">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</p>

      {/* Sections */}
      {overdue.length > 0 && (
        <TaskSection title={`⚠️ Overdue · ${overdue.length}`} titleCls="text-red-400" tasks={overdue} onToggle={toggleTask} onDelete={deleteTask} />
      )}
      {pending.length > 0 && (
        <TaskSection title={`Pending · ${pending.length}`} tasks={pending} onToggle={toggleTask} onDelete={deleteTask} />
      )}
      {completed.length > 0 && (
        <TaskSection title={`Completed · ${completed.length}`} tasks={completed} onToggle={toggleTask} onDelete={deleteTask} />
      )}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
          <p className="text-3xl mb-3">📭</p>
          <p className="text-white/40 text-sm">No tasks match your filters</p>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs md:text-sm text-white/30">{label}:</span>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)}
          className={`text-xs md:text-sm px-2.5 py-1 rounded-lg border transition-all duration-150
            ${value === o ? "border-purple-500/40 bg-purple-500/20 text-white" : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function TaskSection({ title, titleCls = "text-white/30", tasks, onToggle, onDelete }) {
  return (
    <div className="space-y-2">
      <p className={`text-xs font-bold uppercase tracking-widest px-1 ${titleCls}`}>{title}</p>
      {tasks.map((t) => <TaskItem key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} />)}
    </div>
  );
}