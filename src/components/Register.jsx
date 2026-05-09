import { useState, useCallback } from "react";
import { Eye, EyeOff, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import AuthLayout    from "./AuthLayout";
import SuccessScreen from "./SuccessScreen";

// ─── validation ───────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const errs = {};
  if (!form.username.trim())
    errs.username = "Username is required.";
  else if (form.username.trim().length < 3)
    errs.username = "Must be at least 3 characters.";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username.trim()))
    errs.username = "Only letters, numbers and underscores.";

  if (!form.email.trim())
    errs.email = "Email is required.";
  else if (!EMAIL_RE.test(form.email.trim()))
    errs.email = "Please enter a valid email address.";

  if (!form.password)
    errs.password = "Password is required.";
  else if (form.password.length < 6)
    errs.password = "Must be at least 6 characters.";

  if (!form.confirm)
    errs.confirm = "Please confirm your password.";
  else if (form.confirm !== form.password)
    errs.confirm = "Passwords do not match.";

  return errs;
}

// ─── field config (array-driven) ─────────────────────────────────────────────
const FIELDS = [
  {
    key:          "username",
    label:        "Username",
    type:         "text",
    placeholder:  "Choose a username",
    hint:         "3+ chars · letters, numbers, underscores",
    autoComplete: "username",
  },
  {
    key:          "email",
    label:        "Email",
    type:         "email",
    placeholder:  "you@example.com",
    hint:         "We'll use this to identify your account",
    autoComplete: "email",
  },
  {
    key:          "password",
    label:        "Password",
    type:         "password",
    placeholder:  "Create a password",
    hint:         "At least 6 characters",
    autoComplete: "new-password",
    hasToggle:    true,
    hasStrength:  true,
  },
  {
    key:           "confirm",
    label:         "Confirm password",
    type:          "password",
    placeholder:   "Repeat your password",
    hint:          null,
    autoComplete:  "new-password",
    hasMatchCheck: true,
  },
];

// ─── helpers ──────────────────────────────────────────────────────────────────
function inputCls(hasError) {
  return [
    "w-full rounded-xl border px-4 py-2.5 text-sm text-white",
    "bg-zinc-800/50 placeholder-zinc-600 outline-none",
    "transition-all duration-200 focus:bg-zinc-800/80",
    hasError
      ? "border-red-500/40 focus:border-red-400"
      : "border-zinc-700/50 focus:border-purple-500",
  ].join(" ");
}

// ─── StrengthBar ──────────────────────────────────────────────────────────────
function StrengthBar({ password }) {
  const score =
    (password.length >= 8           ? 1 : 0) +
    (/[A-Z]/.test(password)         ? 1 : 0) +
    (/[0-9]/.test(password)         ? 1 : 0) +
    (/[^a-zA-Z0-9]/.test(password)  ? 1 : 0);

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

  return (
    <div className="mt-1.5 space-y-1">
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

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, error, hint, showHint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-[10px] text-red-400">
          <AlertTriangle size={11} className="flex-shrink-0" />
          {error}
        </p>
      ) : hint && showHint ? (
        <p className="text-[10px] text-zinc-600">{hint}</p>
      ) : null}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export default function Register({ setPage }) {
  const [form,     setForm]     = useState({ username: "", email: "", password: "", confirm: "" });
  const [touched,  setTouched]  = useState({});
  const [fieldErr, setFieldErr] = useState({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [success,  setSuccess]  = useState(false);

  const clientErrors  = validate(form);
  const errors        = {
    ...fieldErr,
    ...Object.fromEntries(
      Object.entries(clientErrors).filter(([k]) => touched[k])
    ),
  };
  const isClientValid = Object.keys(clientErrors).length === 0;

  const set  = (field) => (e) => {
    setForm((f)  => ({ ...f,  [field]: e.target.value }));
    setFieldErr((fe) => ({ ...fe, [field]: "" }));
  };
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  // Stable callback so SuccessScreen's useEffect dep array stays clean
  const handleDone = useCallback(() => setPage("login"), [setPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, email: true, password: true, confirm: true });
    if (!isClientValid) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const users       = JSON.parse(localStorage.getItem("users")) || [];
    const normalUser  = form.username.trim().toLowerCase();
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

    localStorage.setItem("users", JSON.stringify([
      ...users,
      {
        username:  form.username.trim(),
        email:     normalEmail,
        password:  form.password,
        createdAt: new Date().toISOString(),
      },
    ]));

    setLoading(false);
    setSuccess(true);
  };

  // ── success screen ──────────────────────────────────────────────────────────
  if (success) return <SuccessScreen onDone={handleDone} />;

  // ── form ────────────────────────────────────────────────────────────────────
  return (
    <AuthLayout>
      <div className="space-y-5">

        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Create account</h1>
          <p className="text-sm text-zinc-500">Join StudyFlow and boost your productivity</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">

          {FIELDS.map((field) => {
            const isPassword  = field.hasToggle || field.hasMatchCheck;
            const resolvedType = isPassword
              ? showPass ? "text" : "password"
              : field.type;

            return (
              <Field
                key={field.key}
                label={field.label}
                error={errors[field.key]}
                hint={field.hint}
                showHint={!touched[field.key]}
              >
                <div className="relative">
                  <input
                    type={resolvedType}
                    value={form[field.key]}
                    onChange={set(field.key)}
                    onBlur={blur(field.key)}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className={inputCls(errors[field.key]) + (field.hasToggle ? " pr-11" : "")}
                    style={{ caretColor: "#a855f7" }}
                  />

                  {field.hasToggle && (
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      tabIndex={-1}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>

                {field.hasStrength && form.password && (
                  <StrengthBar password={form.password} />
                )}

                {field.hasMatchCheck && form.confirm && !errors.confirm && form.password === form.confirm && (
                  <p className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                    <CheckCircle2 size={11} />
                    Passwords match
                  </p>
                )}
              </Field>
            );
          })}

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl
                bg-purple-600 hover:bg-purple-500
                text-sm font-semibold text-white
                transition-colors duration-200
                active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50
              "
              style={{ boxShadow: "0 4px 24px rgba(139,92,246,0.28)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 pb-4">
          Already have an account?{" "}
          <button
            onClick={(e) => { e.preventDefault(); setPage("login"); }}
            className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
          >
            Sign in →
          </button>
        </p>

      </div>
    </AuthLayout>
  );
}