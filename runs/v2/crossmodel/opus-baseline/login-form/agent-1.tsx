import React, { useState, type CSSProperties } from "react";

const colors = {
  background: "#0B0D12",
  card: "#13161D",
  cardBorder: "#23272F",
  text: "#F2F4F8",
  textMuted: "#9AA1AD",
  inputBg: "#0E1015",
  inputBorder: "#2A2F3A",
  inputBorderFocus: "#5B8CFF",
  primary: "#5B8CFF",
  primaryHover: "#6F9BFF",
  primaryText: "#0B0D12",
  secondaryBorder: "#2A2F3A",
  secondaryHover: "#1A1E27",
};

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: colors.background,
    padding: 24,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: colors.card,
    border: `1px solid ${colors.cardBorder}`,
    borderRadius: 16,
    padding: 32,
    boxShadow:
      "0 1px 2px rgba(0,0,0,0.4), 0 20px 48px -12px rgba(0,0,0,0.55)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  title: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.2,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: colors.text,
  },
  subtitle: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.5,
    color: colors.textMuted,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: colors.text,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    height: 44,
    padding: "0 14px",
    fontSize: 15,
    color: colors.text,
    background: colors.inputBg,
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: 10,
    outline: "none",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    width: "100%",
    height: 44,
    fontSize: 15,
    fontWeight: 600,
    color: colors.primaryText,
    background: colors.primary,
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.15s ease, transform 0.05s ease",
  },
  secondaryButton: {
    width: "100%",
    height: 44,
    fontSize: 15,
    fontWeight: 500,
    color: colors.text,
    background: "transparent",
    border: `1px solid ${colors.secondaryBorder}`,
    borderRadius: 10,
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState<string | null>(null);
  const [primaryHover, setPrimaryHover] = useState(false);
  const [secondaryHover, setSecondaryHover] = useState(false);

  const focusStyle = (name: string): CSSProperties =>
    focused === name
      ? {
          borderColor: colors.inputBorderFocus,
          boxShadow: `0 0 0 3px rgba(91,140,255,0.15)`,
        }
      : {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>
            Sign in to your Aperture account to continue.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              style={{ ...styles.input, ...focusStyle("email") }}
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              style={{ ...styles.input, ...focusStyle("password") }}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="submit"
              style={{
                ...styles.primaryButton,
                background: primaryHover ? colors.primaryHover : colors.primary,
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
                  ? colors.secondaryHover
                  : "transparent",
              }}
              onMouseEnter={() => setSecondaryHover(true)}
              onMouseLeave={() => setSecondaryHover(false)}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { LoginForm };
