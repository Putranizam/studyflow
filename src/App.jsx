import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
// import { useAuth } from "./hooks/useAuth"; // Removed as per instructions
import { useStreak } from "./hooks/useStreak";
import { todayStr, isToday, isOverdue } from "./utils/date";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TasksPage from "./components/TasksPage";
import StatsPage from "./components/StatsPage";
import FocusTimer from "./components/FocusTimer";
import Login from "./components/Login";
import Register from "./components/Register";

const INITIAL_TASKS = [
  { id: 1, text: "Review calculus lecture notes", done: false, priority: "high", category: "Study", dueDate: todayStr(), createdAt: new Date().toISOString(), completedAt: null },
  { id: 2, text: "Complete chemistry problem set", done: false, priority: "medium", category: "Assignment", dueDate: todayStr(), createdAt: new Date().toISOString(), completedAt: null },
  { id: 3, text: "Read history chapter 5", done: true, priority: "low", category: "Study", dueDate: todayStr(), createdAt: new Date().toISOString(), completedAt: new Date().toISOString() },
  { id: 4, text: "Prepare biology flashcards", done: false, priority: "high", category: "Study", dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), createdAt: new Date().toISOString(), completedAt: null },
  { id: 5, text: "Submit essay draft", done: false, priority: "medium", category: "Assignment", dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), createdAt: new Date().toISOString(), completedAt: null },
];

export default function App() {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setCurrentPage("login");
  };

  // ── App state (only rendered when logged in) ────────────────────────────────
  const [tasks, setTasks] = useLocalStorage("sf_tasks", INITIAL_TASKS);
  const [focusSessions, setFocusSessions] = useLocalStorage("sf_sessions", { date: todayStr(), count: 0, totalMinutes: 0 });
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const streak = useStreak(tasks);

  const todaySessions = focusSessions.date === todayStr()
    ? focusSessions
    : { date: todayStr(), count: 0, totalMinutes: 0 };

  const addTask = useCallback((taskData) => {
    setTasks((prev) => [{ id: Date.now(), done: false, createdAt: new Date().toISOString(), completedAt: null, ...taskData }, ...prev]);
  }, [setTasks]);

  const toggleTask = useCallback((id) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done, completedAt: !t.done ? new Date().toISOString() : null } : t));
  }, [setTasks]);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, [setTasks]);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, [setTasks]);

  const onSessionComplete = useCallback((durationMinutes) => {
    setFocusSessions((prev) => {
      const base = prev.date === todayStr() ? prev : { date: todayStr(), count: 0, totalMinutes: 0 };
      return { date: todayStr(), count: base.count + 1, totalMinutes: base.totalMinutes + durationMinutes };
    });
  }, [setFocusSessions]);

  const overdueTasks   = tasks.filter((t) => isOverdue(t.dueDate) && !t.done);
  const todayTasks     = tasks.filter((t) => isToday(t.dueDate) || (!t.dueDate && !t.done));
  const completedToday = tasks.filter((t) => t.done && t.completedAt?.slice(0, 10) === todayStr());

  const shared = { tasks, addTask, toggleTask, deleteTask, updateTask, streak, todaySessions, todayTasks, overdueTasks, completedToday };

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (!currentUser) {
    return currentPage === "register" ? (
      <Register setPage={setCurrentPage} />
    ) : (
      <Login setPage={setCurrentPage} setUser={setCurrentUser} />
    );
  }

  // ── Authenticated app ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex overflow-hidden relative" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-700/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-700/10 blur-[120px]" />
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f]/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg,#a855f7,#3b82f6)", boxShadow: "0 4px 12px rgba(168,85,247,0.35)" }}>S</div>
              <span className="font-bold text-white tracking-tight text-lg">StudyFlow</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: "⊞" },
              { id: "tasks",     label: "Tasks",     icon: "✓" },
              { id: "stats",     label: "Statistics",icon: "◈" },
            ].map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveNav(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left font-medium transition-all ${active ? "bg-gradient-to-r from-purple-500/20 to-blue-500/10 text-white border border-purple-500/20" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                >
                  <span className={`text-lg ${active ? "text-purple-400" : ""}`}>{item.icon}</span>
                  {item.label}
                  {item.id === "tasks" && overdueTasks.length > 0 && (
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">{overdueTasks.length}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-5 border-t border-white/5 space-y-4 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
                {currentUser?.username?.slice(0, 2).toUpperCase() || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{currentUser?.username}</p>
                <p className="text-xs text-white/40 truncate">{currentUser?.email || "Student"}</p>
              </div>
            </div>
            <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-red-500/10 hover:text-red-400 border border-white/5 transition-all">
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M10 10l3-3-3-3M13 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}

      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        overdueCount={overdueTasks.length}
        currentUser={currentUser}
        onLogout={logout}
      />

      <main className={`relative z-10 flex-1 transition-all duration-300 overflow-y-auto ${sidebarOpen ? "md:ml-48 lg:ml-56" : "md:ml-12 lg:ml-16"} ml-0`}>
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-white/70 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-tight" style={{ background: "linear-gradient(90deg,white,rgba(255,255,255,0.55))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {activeNav === "dashboard" && `Good to see you, ${currentUser.username} 👋`}
                {activeNav === "tasks" && "My Tasks"}
                {activeNav === "stats" && "Statistics"}
              </h1>
              <p className="text-sm text-white/40 mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>
          <FocusTimer todaySessions={todaySessions} onSessionComplete={onSessionComplete} />
        </header>

        <div className="px-4 md:px-8 py-6 md:py-8 max-w-5xl mx-auto">
          {activeNav === "dashboard" && <Dashboard {...shared} setActiveNav={setActiveNav} />}
          {activeNav === "tasks"     && <TasksPage {...shared} />}
          {activeNav === "stats"     && <StatsPage tasks={tasks} todaySessions={todaySessions} streak={streak} />}
        </div>
      </main>
    </div>
  );
}