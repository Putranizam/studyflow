import { useState } from "react";
import AuthLayout from "./AuthLayout";

// ─── tiny helpers ─────────────────────────────────────────────────────────────
function inputCls(hasError) {
  return [
    "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white",
    "placeholder-white/20 outline-none transition-all duration-200 focus:bg-purple-900/10",
    hasError
      ? "border-red-500/50 focus:border-red-400"
      : "border-white/10 focus:border-purple-500/50",
  ].join(" ");
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────
export default function Login({ setUser, setPage }) {
  const [form, setForm]       = useState({ identifier: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [globalErr, setGlobal] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // live-clear errors on change
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: "" }));
    setGlobal("");
  };

  // inline validation
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
    const key = form.identifier.trim().toLowerCase();
    
    const user = users.find(
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
      email: user.email,
      loginAt: new Date().toISOString(),
    };
    localStorage.setItem("currentUser", JSON.stringify(session));
    setUser(session);
  };

  const isValid = form.identifier.trim() && form.password;

  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
          <p className="text-sm text-white/40">Sign in to continue your study sessions</p>
        </div>

        {/* ── Global error ── */}
        {globalErr && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 animate-[fadeIn_0.2s_ease]">
            <span className="text-red-400 flex-shrink-0">⚠</span>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm select-none"
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 mt-2"
            style={
              isValid && !loading
                ? { background: "linear-gradient(135deg,#7c3aed,#2563eb)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }
                : { background: "rgba(255,255,255,0.08)" }
            }
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* ── Switch ── */}
        <p className="text-center text-sm text-white/30">
          Don't have an account?{" "}
          <button
            onClick={(e) => { e.preventDefault(); setPage("register"); }}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Create one →
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}