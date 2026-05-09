import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  X,
  MoreVertical,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Menu",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "tasks",     label: "Tasks",     icon: CheckSquare, badge: 3 },
      { id: "stats",     label: "Statistics", icon: BarChart3 },
    ],
  },
  {
    label: "Other",
    items: [
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      onClick={() => onClick(item.id)}
      className={[
        "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 text-left focus:outline-none border-l-2",
        isActive
          ? "bg-white/5 border-l-violet-500 text-white rounded-r-xl backdrop-blur-sm"
          : "border-l-transparent text-zinc-500 hover:text-white hover:bg-white/[0.04] rounded-xl",
      ].join(" ")}
    >
      <Icon size={18} className={`flex-shrink-0 transition-colors duration-200 ${isActive ? "text-violet-400" : ""}`} />
      <span className="flex-1">{item.label}</span>
      {item.badge != null && (
        <span className={[
          "text-[11px] font-medium px-2 py-0.5 rounded-full",
          isActive ? "bg-violet-500/15 text-violet-400" : "bg-white/[0.06] text-zinc-400",
        ].join(" ")}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

export default function MobileSidebar({
  isOpen,
  onClose,
  activeNav,
  setActiveNav,
  currentUser,
  onLogout,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={[
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Sidebar */}
      <aside
        aria-label="Mobile navigation"
        className={[
          "fixed top-0 left-0 z-50 w-[280px] bg-[#0B0A0F]",
          "flex flex-col h-screen",
          "border-r border-white/[0.07] rounded-r-2xl overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 pt-5 pb-0 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-white text-[15px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#3B82F6)" }}
            >
              S
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              StudyFlow
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06] mt-5 mb-2 flex-shrink-0" />

        {/* NAVIGATION */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 space-y-0.5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-2 pt-2.5 pb-1.5 text-[10px] font-medium text-zinc-600 uppercase tracking-[0.08em]">
                {section.label}
              </p>
              {section.items.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeNav === item.id}
                  onClick={(id) => {
                    setActiveNav(id);
                    onClose();
                  }}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="flex-shrink-0 border-t border-white/[0.06] p-3 space-y-1.5">
          {/* User row */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-default group">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold tracking-wide flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7C3AED,#DB2777)" }}
            >
              {currentUser?.username?.slice(0, 2).toUpperCase() ?? "??"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white/90 truncate leading-tight">
                {currentUser?.username ?? "User"}
              </p>
              <p className="text-[11px] text-zinc-600 truncate leading-tight mt-0.5">
                {currentUser?.email ?? ""}
              </p>
            </div>
            <MoreVertical size={17} className="text-zinc-600 group-hover:text-zinc-400 transition-colors flex-shrink-0" />
          </div>

          {/* Sign out */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border border-zinc-800 text-zinc-500 text-[13px] hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}