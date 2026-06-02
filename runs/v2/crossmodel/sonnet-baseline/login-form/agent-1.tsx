import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [signInHovered, setSignInHovered] = useState(false);
  const [createHovered, setCreateHovered] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "48px",
      width: "100%",
      maxWidth: "420px",
      boxSizing: "border-box",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 20px 40px -8px rgba(0, 0, 0, 0.06)",
    },
    logoMark: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      backgroundColor: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "32px",
    },
    logoInner: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: "2.5px solid #ffffff",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    logoCenter: {
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      backgroundColor: "#ffffff",
    },
    title: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#0f172a",
      margin: "0 0 8px 0",
      letterSpacing: "-0.4px",
      lineHeight: "1.25",
    },
    subtitle: {
      fontSize: "15px",
      color: "#64748b",
      margin: "0 0 36px 0",
      lineHeight: "1.5",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "0px",
    },
    fieldGroup: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "20px",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "6px",
      letterSpacing: "0.01em",
    },
    inputBase: {
      width: "100%",
      padding: "11px 14px",
      fontSize: "15px",
      color: "#0f172a",
      backgroundColor: "#f8fafc",
      border: "1.5px solid #e2e8f0",
      borderRadius: "10px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      WebkitAppearance: "none",
    },
    inputFocused: {
      borderColor: "#6366f1",
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.12)",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      marginTop: "8px",
    },
    primaryButton: {
      width: "100%",
      padding: "12px 20px",
      fontSize: "15px",
      fontWeight: "600",
      color: "#ffffff",
      backgroundColor: signInHovered ? "#4f46e5" : "#6366f1",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.01em",
      transition: "background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease",
      boxShadow: signInHovered
        ? "0 4px 12px rgba(99, 102, 241, 0.4)"
        : "0 2px 6px rgba(99, 102, 241, 0.25)",
      transform: signInHovered ? "translateY(-1px)" : "translateY(0)",
    },
    secondaryButton: {
      width: "100%",
      padding: "12px 20px",
      fontSize: "15px",
      fontWeight: "500",
      color: createHovered ? "#4f46e5" : "#475569",
      backgroundColor: createHovered ? "#f5f3ff" : "#f8fafc",
      border: "1.5px solid",
      borderColor: createHovered ? "#c7d2fe" : "#e2e8f0",
      borderRadius: "10px",
      cursor: "pointer",
      outline: "none",
      letterSpacing: "0.01em",
      transition: "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      margin: "4px 0",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      backgroundColor: "#e2e8f0",
    },
    dividerText: {
      fontSize: "12px",
      color: "#94a3b8",
      fontWeight: "500",
    },
    forgotLink: {
      fontSize: "13px",
      color: "#6366f1",
      fontWeight: "500",
      textDecoration: "none",
      cursor: "pointer",
      textAlign: "right" as const,
      display: "block",
      marginTop: "6px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoMark}>
          <div style={styles.logoInner}>
            <div style={styles.logoCenter} />
          </div>
        </div>

        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Sign in to your Aperture account to continue.</p>

        <form onSubmit={handleSignIn} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                ...styles.inputBase,
                ...(emailFocused ? styles.inputFocused : {}),
              }}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              placeholder="Enter your password"
              autoComplete="current-password"
              style={{
                ...styles.inputBase,
                ...(passwordFocused ? styles.inputFocused : {}),
              }}
            />
            <a href="#" style={styles.forgotLink} onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.primaryButton}
              onMouseEnter={() => setSignInHovered(true)}
              onMouseLeave={() => setSignInHovered(false)}
            >
              Sign in
            </button>

            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or</span>
              <div style={styles.dividerLine} />
            </div>

            <button
              type="button"
              style={styles.secondaryButton}
              onMouseEnter={() => setCreateHovered(true)}
              onMouseLeave={() => setCreateHovered(false)}
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
