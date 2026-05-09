const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "tasks",     label: "Tasks",     icon: "✓" },
  { id: "stats",     label: "Statistics",icon: "◈" },
];

export default function Sidebar({ open, setOpen, activeNav, setActiveNav, overdueCount, currentUser, onLogout }) {
  const initials = currentUser?.username?.slice(0, 2).toUpperCase() || "?";

  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 h-full z-30 flex-col transition-all duration-300 ease-in-out ${open ? "w-48 lg:w-56" : "w-12 lg:w-16"} border-r border-white/5`}
      style={{ background: "rgba(13,13,20,0.95)", backdropFilter: "blur(20px)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 lg:gap-3 px-2 lg:px-4 py-4 lg:py-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#a855f7,#3b82f6)", boxShadow: "0 4px 12px rgba(168,85,247,0.35)" }}>S</div>
        {open && <span className="font-bold text-white tracking-tight text-lg">StudyFlow</span>}
        <button onClick={() => setOpen(!open)} className="ml-auto p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {open ? <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1 lg:px-2 py-3 lg:py-4 space-y-1">
        {NAV.map((item) => {
          const active = activeNav === item.id;
          return (
              <button key={item.id} onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 rounded-xl text-xs lg:text-sm font-medium transition-all duration-200 group relative
                ${active ? "text-white border border-purple-500/20" : "text-white/40 hover:text-white/80 hover:bg-white/5"}`}
              style={active ? { background: "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(59,130,246,0.12))" } : {}}>
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "linear-gradient(to bottom,#a855f7,#3b82f6)" }} />}
                <span className={`text-sm lg:text-base flex-shrink-0 ${active ? "text-purple-300" : "group-hover:scale-110 transition-transform"}`}>{item.icon}</span>
              {open && <span>{item.label}</span>}
              {open && item.id === "tasks" && overdueCount > 0 && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">{overdueCount}</span>
              )}
              {active && open && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" style={{ boxShadow: "0 0 6px rgba(168,85,247,0.7)" }} />}
            </button>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/5 p-2 lg:p-3 space-y-2">
        <div className={`flex items-center gap-2 lg:gap-3 ${!open && "justify-center"}`}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>{initials}</div>
          {open && (
            <div className="flex-1 min-w-0">
              <p className="text-xs lg:text-sm font-semibold text-white/90 truncate">{currentUser?.username}</p>
              <p className="text-[10px] lg:text-xs text-white/30">Student</p>
            </div>
          )}
        </div>
        <button onClick={onLogout}
          className={`w-full flex items-center gap-2 px-2 lg:px-3 py-1.5 lg:py-2 rounded-xl text-[10px] lg:text-xs font-semibold text-white/35 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 ${!open && "justify-center"}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {open && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}