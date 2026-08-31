import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../adminApi";
import AdminLogin from "../components/admin/AdminLogin";
import RequestDetail from "../components/admin/RequestDetail";
import FeedbackModeration from "../components/admin/FeedbackModeration";

const STATUS_BADGE = {
  pending: "bg-sand text-pine-dark",
  quoted: "bg-brass/30 text-brass-dark",
  confirmed: "bg-pine text-sand-light",
  declined: "bg-red-100 text-red-700",
  cancelled: "bg-ink/10 text-ink/50"
};

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(adminApi.isLoggedIn());
  const [tab, setTab] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    adminApi
      .listQuotes({ status: statusFilter, tier: tierFilter })
      .then(setRequests)
      .catch((err) => {
        setError(err.message);
        if (err.message === "Not authenticated") setLoggedIn(false);
      })
      .finally(() => setLoading(false));
  }, [statusFilter, tierFilter]);

  useEffect(() => {
    if (loggedIn) load();
  }, [loggedIn, load]);

  // Poll for new pending requests so staff notice without refreshing —
  // this is the in-app half of the alert; sendAdminAlertEmail (server-side)
  // is the out-of-app half, firing once per new request regardless of
  // whether anyone has the dashboard open.
  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;
    function poll() {
      adminApi
        .getPendingCount()
        .then(({ count }) => {
          if (cancelled) return;
          setPendingCount(count);
          document.title = count > 0 ? `(${count}) Kilele Admin` : "Kilele Admin";
        })
        .catch(() => {});
    }

    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      document.title = "Kilele Admin";
    };
  }, [loggedIn]);

  if (!loggedIn) {
    return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  }

  async function handleLogout() {
    await adminApi.logout();
    setLoggedIn(false);
  }

  function handleUpdated(updated) {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
    setSelected((prev) => (prev && prev.id === updated.id ? { ...prev, ...updated } : prev));
    adminApi.getPendingCount().then(({ count }) => setPendingCount(count)).catch(() => {});
  }

  const counts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono text-brass-dark mb-1">
            Staff area
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-pine">Requests</h1>
            {pendingCount > 0 && (
              <span className="bg-brass text-pine-dark text-xs font-bold px-2.5 py-1 rounded-full">
                {pendingCount} new
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-ink/60 hover:text-ink border border-brass/25 px-4 py-2 rounded-sm"
        >
          Sign out
        </button>
      </div>

      {pendingCount > 0 && tab === "requests" && (
        <div className="bg-brass/15 border border-brass/30 rounded-sm px-4 py-3 mb-6 flex items-center justify-between gap-3">
          <span className="text-sm text-pine-dark">
            {pendingCount} {pendingCount === 1 ? "request is" : "requests are"} waiting for a quote.
          </span>
          <button
            onClick={() => setStatusFilter("pending")}
            className="text-xs font-semibold text-brass-dark hover:text-pine flex-shrink-0"
          >
            Show them →
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-8 bg-sand border border-brass/25 rounded-full p-1 max-w-xs">
        {[
          { id: "requests", label: "Requests" },
          { id: "feedback", label: "Feedback" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              tab === t.id ? "bg-pine text-sand-light" : "text-ink/60 hover:text-pine"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "feedback" ? (
        <FeedbackModeration />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-brass/30 rounded-sm px-3 py-2 text-sm"
            >
              <option value="">All statuses</option>
              {["pending", "quoted", "confirmed", "declined", "cancelled"].map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)} {counts[s] ? `(${counts[s]})` : ""}
                </option>
              ))}
            </select>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="bg-white border border-brass/30 rounded-sm px-3 py-2 text-sm"
            >
              <option value="">All tiers</option>
              <option value="standard">Standard</option>
              <option value="vip">VIP</option>
            </select>
            <button
              onClick={load}
              className="text-sm font-medium text-brass-dark hover:text-brass ml-auto"
            >
              Refresh
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6">
              {error}
            </p>
          )}

          {loading ? (
            <p className="text-ink/50 font-mono text-sm">Loading…</p>
          ) : requests.length === 0 ? (
            <p className="text-ink/50 text-sm">No requests match these filters.</p>
          ) : (
            <div className="bg-white/60 border border-brass/20 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b border-brass/20">
                    <th className="px-4 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Occasion</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Tier</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="border-b border-brass/10 last:border-0 hover:bg-sand/40 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-brass-dark">{r.reference}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-ink/90">{r.full_name}</div>
                        <div className="text-xs text-ink/50">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-ink/70 capitalize">{r.occasion}</td>
                      <td className="px-4 py-3 text-ink/70">{r.travel_date}</td>
                      <td className="px-4 py-3">
                        {r.tier === "vip" ? (
                          <span className="text-xs font-medium text-brass-dark">VIP</span>
                        ) : (
                          <span className="text-xs text-ink/50">Standard</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-ink/60 capitalize">
                        {r.payment_status === "unpaid" ? "—" : r.payment_status.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[r.status] || ""}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {selected && (
        <RequestDetail
          request={selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
