import React, { useState, CSSProperties } from "react";

const palette = {
  bg: "#FAFAFB",
  card: "#FFFFFF",
  border: "#E6E7EB",
  borderFocus: "#6366F1",
  text: "#111827",
  subtle: "#6B7280",
  placeholder: "#9CA3AF",
  primary: "#4F46E5",
  primaryHover: "#4338CA",
  secondaryText: "#374151",
  secondaryHover: "#F3F4F6",
  fieldBg: "#FFFFFF",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `radial-gradient(120% 120% at 50% 0%, #F4F4FF 0%, ${palette.bg} 55%)`,
    padding: 24,
    boxSizing: "border-box",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: palette.card,
    borderRadius: 20,
    border: `1px solid ${palette.border}`,
    boxShadow:
      "0 1px 2px rgba(16,24,40,0.04), 0 12px 32px -8px rgba(16,24,40,0.12)",
    padding: 36,
    boxSizing: "border-box",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: `linear-gradient(135deg, ${palette.primary} 0%, #7C3AED 100%)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: 18,
    letterSpacing: -0.5,
    boxShadow: "0 4px 12px -2px rgba(79,70,229,0.45)",
  },
  brandName: {
    fontSize: 15,
    fontWeight: 600,
    color: palette.text,
    letterSpacing: -0.2,
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
    color: palette.text,
    letterSpacing: -0.6,
    lineHeight: 1.2,
  },
  subtitle: {
    margin: "8px 0 0",
    fontSize: 15,
    color: palette.subtle,
    lineHeight: 1.5,
  },
  form: {
    marginTop: 28,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 7,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: palette.secondaryText,
    letterSpacing: -0.1,
  },
  input: {
    width: "100%",
    height: 46,
    padding: "0 14px",
    fontSize: 15,
    color: palette.text,
    background: palette.fieldBg,
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  inputFocus: {
    borderColor: palette.borderFocus,
    boxShadow: "0 0 0 4px rgba(99,102,241,0.15)",
  },
  forgotRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: -4,
  },
  forgotLink: {
    fontSize: 13,
    fontWeight: 600,
    color: palette.primary,
    textDecoration: "none",
  },
  primaryButton: {
    width: "100%",
    height: 48,
    marginTop: 4,
    fontSize: 15,
    fontWeight: 600,
    color: "#FFFFFF",
    background: palette.primary,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: -0.1,
    boxShadow: "0 6px 16px -4px rgba(79,70,229,0.5)",
    transition: "background 0.15s ease, transform 0.08s ease",
  },
  secondaryButton: {
    width: "100%",
    height: 48,
    fontSize: 15,
    fontWeight: 600,
    color: palette.secondaryText,
    background: "#FFFFFF",
    border: `1px solid ${palette.border}`,
    borderRadius: 12,
    cursor: "pointer",
    letterSpacing: -0.1,
    transition: "background 0.15s ease, border-color 0.15s ease",
  },
};

export default function LoginForm() {
  const [focused, setFocused] = useState<string | null>(null);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  const inputStyle = (name: string): CSSProperties => ({
    ...styles.input,
    ...(focused === name ? styles.inputFocus : null),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.brandMark}>A</div>
          <span style={styles.brandName}>Aperture</span>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>
          Sign in to your account to continue where you left off.
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              style={inputStyle("email")}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              style={inputStyle("password")}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
            />
            <div style={styles.forgotRow}>
              <a href="#" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            style={{
              ...styles.primaryButton,
              background: primaryHover
                ? palette.primaryHover
                : palette.primary,
            }}
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
          >
            Sign in
          </button>

          <button
            type="button"
            style={{
              ...styles.secondaryButton,
              background: secondaryHover
                ? palette.secondaryHover
                : "#FFFFFF",
            }}
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
