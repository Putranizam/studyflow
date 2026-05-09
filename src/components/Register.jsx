import { useState } from "react";
import AuthLayout from "./AuthLayout";

// ─── validation ───────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errs = {};

  // username
  if (!form.username.trim())
    errs.username = "Username is required.";
  else if (form.username.trim().length < 3)
    errs.username = "Must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
    errs.username = "Only letters, numbers and underscores.";

  // email
  if (!form.email.trim())
    errs.email = "Email is required.";
  else if (!EMAIL_RE.test(form.email.trim()))
    errs.email = "Please enter a valid email address.";

  // password
  if (!form.password)
    errs.password = "Password is required.";
  else if (form.password.length < 6)
    errs.password = "Must be at least 6 characters.";

  // confirm
  if (!form.confirm)
    errs.confirm = "Please confirm your password.";
  else if (form.confirm !== form.password)
    errs.confirm = "Passwords do not match.";

  return errs;
}

// ─── sub-components ───────────────────────────────────────────────────────────
function inputCls(hasError) {
  return [
    "w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white",
    "placeholder-white/20 outline-none transition-all duration-200 focus:bg-purple-900/10",
    hasError
      ? "border-red-500/50 focus:border-red-400"
      : "border-white/10 focus:border-purple-500/50",
  ].join(" ");
}

function Field({ label, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-red-400">
          <span>⚠</span> {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-white/20">{hint}</p>
      ) : null}
    </div>
  );
}

function StrengthBar({ password }) {
  const score =
    (password.length >= 8      ? 1 : 0) +
    (/[A-Z]/.test(password)    ? 1 : 0) +
    (/[0-9]/.test(password)    ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(password) ? 1 : 0);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : "rgba(255,255,255,0.08)" }}
          />
        ))}
      </div>
      {score > 0 && (
        <p className="text-[10px] font-medium" style={{ color: colors[score] }}>
          {labels[score]} password
        </p>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export default function Register({ setPage }) {
  const [form,    setForm]    = useState({ username: "", email: "", password: "", confirm: "" });
  const [touched, setTouched] = useState({});
  const [fieldErr, setFieldErr] = useState({}); // server-side field errors
  const [loading, setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success,  setSuccess]  = useState(false);

  const clientErrors = validate(form);
  // merge client + server field errors, client takes priority while typing
  const errors = { ...fieldErr, ...Object.fromEntries(
    Object.entries(clientErrors).filter(([k]) => touched[k])
  )};
  const isClientValid = Object.keys(clientErrors).length === 0;

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setFieldErr((fe) => ({ ...fe, [field]: "" })); // clear server error on re-type
  };

  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // touch all fields to show all errors
    setTouched({ username: true, email: true, password: true, confirm: true });
    if (!isClientValid) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const normalUser = form.username.trim().toLowerCase();
    const normalEmail = form.email.trim().toLowerCase();

    if (users.find((u) => u.username.toLowerCase() === normalUser)) {
      setFieldErr({ username: "Username is already taken." });
      setTouched((t) => ({ ...t, username: true }));
      setLoading(false);
      return;
    }
    if (users.find((u) => u.email.toLowerCase() === normalEmail)) {
      setFieldErr({ email: "An account with this email already exists." });
      setTouched((t) => ({ ...t, email: true }));
      setLoading(false);
      return;
    }

    const newUser = {
      username: form.username.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setPage("login"), 1800);
  };

  // ── success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-8 space-y-4">
          <div className="text-5xl animate-bounce">🎉</div>
          <h2 className="text-xl font-black text-white">Account created!</h2>
          <p className="text-sm text-white/40">Redirecting you to login…</p>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mt-4">
            <div
              className="h-full rounded-full animate-[growWidth_1.8s_linear_forwards]"
              style={{ background: "linear-gradient(90deg,#a855f7,#3b82f6)" }}
            />
          </div>
        </div>
      </AuthLayout>
    );
  }

  // ── form ────────────────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">Create account</h1>
          <p className="text-sm text-white/40">Join StudyFlow and boost your productivity</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Username */}
          <Field
            label="Username"
            error={errors.username}
            hint={!touched.username ? "3+ chars · letters, numbers, underscores" : undefined}
          >
            <input
              type="text"
              value={form.username}
              onChange={set("username")}
              onBlur={blur("username")}
              placeholder="Choose a username"
              autoComplete="username"
              className={inputCls(errors.username)}
              style={{ caretColor: "#a855f7" }}
            />
          </Field>

          {/* Email */}
          <Field
            label="Email"
            error={errors.email}
            hint={!touched.email ? "We'll use this to identify your account" : undefined}
          >
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              onBlur={blur("email")}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputCls(errors.email)}
              style={{ caretColor: "#a855f7" }}
            />
          </Field>

          {/* Password */}
          <Field
            label="Password"
            error={errors.password}
            hint={!touched.password ? "At least 6 characters" : undefined}
          >
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={set("password")}
                onBlur={blur("password")}
                placeholder="Create a password"
                autoComplete="new-password"
                className={inputCls(errors.password) + " pr-11"}
                style={{ caretColor: "#a855f7" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm select-none"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {form.password && <StrengthBar password={form.password} />}
          </Field>

          {/* Confirm password */}
          <Field label="Confirm Password" error={errors.confirm}>
            <input
              type={showPass ? "text" : "password"}
              value={form.confirm}
              onChange={set("confirm")}
              onBlur={blur("confirm")}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={inputCls(errors.confirm)}
              style={{ caretColor: "#a855f7" }}
            />
            {form.confirm && !errors.confirm && form.password === form.confirm && (
              <p className="text-xs text-emerald-400 mt-1">✓ Passwords match</p>
            )}
          </Field>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100 mt-1"
            style={
              !loading
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
                Creating account…
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/30">
          Already have an account?{" "}
          <button
            onClick={(e) => { e.preventDefault(); setPage("login"); }}
            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
          >
            Sign in →
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}