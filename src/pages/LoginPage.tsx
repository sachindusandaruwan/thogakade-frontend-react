
import { useState } from "react";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      onLoginSuccess();
    } catch {
      setError("Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h1 style={styles.title}>Thogakade POS</h1>
        <p style={styles.subtitle}>Sign in to your account</p>

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          autoComplete="username"
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          autoComplete="current-password"
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box" as const,
    padding: "32px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
  },
  title: {
    margin: "0 0 8px",
    textAlign: "center" as const,
    color: "#1e293b",
  },
  subtitle: {
    textAlign: "center" as const,
    color: "#64748b",
    marginBottom: "28px",
  },
  label: {
    marginBottom: "8px",
    color: "#334155",
    fontWeight: 600,
  },
  input: {
    padding: "12px",
    marginBottom: "20px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "15px",
  },
  button: {
    padding: "13px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "#dc2626",
    fontSize: "14px",
  },
};

export default LoginPage;
