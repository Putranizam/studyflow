import { LayoutDashboard, CheckSquare, BarChart2, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

// ─── nav config ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { id: "tasks",     label: "Tasks",      icon: CheckSquare     },
  { id: "stats",     label: "Statistics", icon: BarChart2       },
];

// ─── NavItem ──────────────────────────────────────────────────────────────────
function NavItem({ item, active, open, onClick, badge }) {
  const Icon = item.icon;
  return (
    <li>
      <button
        onClick={() => onClick(item.id)}
        title={!open ? item.label : undefined}
        className={`
          relative w-full flex items-center gap-4
          pl-5 pr-3 py-2.5
          transition-all duration-200
          group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30
          ${active
            ? "bg-white/5 backdrop-blur-sm border-l-4 border-purple-500 text-white"
            : "border-l-4 border-transparent text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
          }
        `}
      >
        {/* Icon */}
        <Icon
          size={20}
          className={`flex-shrink-0 transition-colors duration-200
            ${active ? "text-purple-400" : "text-zinc-500 group-hover:text-zinc-300"}
          `}
        />

        {/* Label */}
        {open && (
          <span className={`text-sm flex-1 text-left truncate
            ${active ? "text-white font-semibold" : "text-zinc-500 group-hover:text-zinc-200"}
          `}>
            {item.label}
          </span>
        )}

        {/* Overdue badge */}
        {open && badge > 0 && (
          <span className="ml-auto text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
            {badge}
          </span>
        )}
      </button>
    </li>
  );
}

// ─── UserAvatar ───────────────────────────────────────────────────────────────
function UserAvatar({ username }) {
  const initials = username?.slice(0, 2).toUpperCase() ?? "?";
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
      <span className="text-sm font-semibold text-white leading-none">{initials}</span>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
export default function Sidebar({
  open,
  setOpen,
  activeNav,
  setActiveNav,
  overdueCount,
  currentUser,
  onLogout,
}) {
  return (
    <aside
      className={`
        hidden md:flex fixed left-0 top-0 h-full z-30
        flex-col
        border-r border-white/5
        transition-all duration-300 ease-in-out
        ${open ? "w-56" : "w-16"}
      `}
      style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg,#a855f7,#3b82f6)" }}
        >
          S
        </div>

        {open && (
          <span className="text-sm font-semibold text-white tracking-tight flex-1 truncate">
            StudyFlow
          </span>
        )}

        <button
          onClick={() => setOpen(!open)}
          className={`
            flex-shrink-0 w-6 h-6 flex items-center justify-center
            rounded-lg text-zinc-600
            hover:text-zinc-300 hover:bg-white/5
            transition-all duration-200
            ${!open && "mx-auto"}
          `}
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
        >
          {open ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              active={activeNav === item.id}
              open={open}
              onClick={setActiveNav}
              badge={item.id === "tasks" ? overdueCount : 0}
            />
          ))}
        </ul>
      </nav>

      {/* ── User section ── */}
      <div className="border-t border-white/5 px-4 pt-4 pb-5 space-y-3">

        {/* Profile row */}
        <div className={`flex items-center gap-3 min-w-0 ${!open && "justify-center"}`}>
          <UserAvatar username={currentUser?.username} />
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {currentUser?.username ?? "User"}
              </p>
              <p className="text-[10px] text-zinc-600 truncate mt-0.5">
                {currentUser?.email ?? ""}
              </p>
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={onLogout}
          title={!open ? "Sign out" : undefined}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-xl
            bg-transparent border border-zinc-800
            text-sm text-zinc-500
            hover:text-white hover:border-zinc-600 hover:bg-white/5
            transition-all duration-200
            ${!open ? "justify-center" : "justify-start"}
          `}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}