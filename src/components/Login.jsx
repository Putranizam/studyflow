import { useState } from "react";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "./AuthLayout";

// ─── helpers ──────────────────────────────────────────────────────────────────
function inputCls(hasError) {
  return [
    "w-full rounded-xl border px-4 py-3 text-sm text-white",
    "bg-zinc-900/50 placeholder-zinc-600 outline-none",
    "transition-all duration-200 focus:bg-zinc-900/70",
    hasError
      ? "border-red-500/40 focus:border-red-400"
      : "border-zinc-800 focus:border-purple-500",
  ].join(" ");
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertTriangle size={12} className="flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────
export default function Login({ setUser, setPage }) {
  const [form,      setForm]    = useState({ identifier: "", password: "" });
  const [errors,    setErrors]  = useState({});
  const [globalErr, setGlobal]  = useState("");
  const [loading,   setLoading] = useState(false);
  const [showPass,  setShowPass] = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
    setGlobal("");
  };

  function validate() {
    const errs = {};
    if (!form.identifier.trim()) errs.identifier = "Username or email is required.";
    if (!form.password)          errs.password   = "Password is required.";
    return errs;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 380));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const key   = form.identifier.trim().toLowerCase();
    const user  = users.find(
      (u) =>
        (u.username.toLowerCase() === key || u.email.toLowerCase() === key) &&
        u.password === form.password
    );

    setLoading(false);

    if (!user) {
      setGlobal("Incorrect username / email or password.");
      return;
    }

    const session = {
      username: user.username,
      email:    user.email,
      loginAt:  new Date().toISOString(),
    };
    localStorage.setItem("currentUser", JSON.stringify(session));
    setUser(session);
  };

  const isValid = form.identifier.trim() && form.password;

  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-zinc-500">Sign in to continue your study sessions</p>
        </div>

        {/* ── Global error ── */}
        {globalErr && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <AlertTriangle size={15} className="text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{globalErr}</p>
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Identifier */}
          <Field label="Username or Email" error={errors.identifier}>
            <input
              type="text"
              value={form.identifier}
              onChange={set("identifier")}
              placeholder="Enter username or email"
              autoComplete="username"
              className={inputCls(errors.identifier)}
              style={{ caretColor: "#a855f7" }}
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={inputCls(errors.password) + " pr-11"}
                style={{ caretColor: "#a855f7" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                tabIndex={-1}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={!isValid || loading}
              className="
                w-full py-3 rounded-xl
                bg-purple-600 hover:bg-purple-500
                text-sm font-semibold text-white
                transition-colors duration-200
                active:scale-[0.98]
                disabled:opacity-40 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50
              "
              style={{ boxShadow: isValid && !loading ? "0 4px 24px rgba(139,92,246,0.30)" : "none" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        {/* ── Switch ── */}
        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <button
            onClick={(e) => { e.preventDefault(); setPage("register"); }}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Create one →
          </button>
        </p>

      </div>
    </AuthLayout>
  );
}