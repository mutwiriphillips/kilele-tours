import { useState } from "react";
import { adminApi } from "../../adminApi";

export default function AdminLogin({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminApi.login(password);
      onLoggedIn();
    } catch (err) {
      setError(err.message || "Incorrect password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white/70 border border-brass/25 rounded-sm p-8">
        <div className="text-xs uppercase tracking-[0.2em] font-mono text-brass-dark mb-2">
          Staff access
        </div>
        <h1 className="font-display text-2xl text-pine mb-6">Kilele Admin</h1>

        <label className="block mb-5">
          <span className="text-sm font-medium text-ink/80 mb-1.5 block">Password</span>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-brass/30 rounded-sm px-4 py-3 focus:border-brass transition-colors"
          />
        </label>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-5">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pine text-sand-light font-medium px-6 py-3 rounded-sm hover:bg-pine-dark transition-colors disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
