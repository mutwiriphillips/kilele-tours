import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../../adminApi";

export default function FeedbackModeration() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    setError("");
    adminApi
      .listFeedback({ approved: filter })
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function setApproved(id, approved) {
    try {
      const updated = await adminApi.moderateFeedback(id, approved);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this feedback permanently?")) return;
    try {
      await adminApi.deleteFeedback(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-brass/30 rounded-sm px-3 py-2 text-sm"
        >
          <option value="">All feedback</option>
          <option value="0">Pending review</option>
          <option value="1">Approved (public)</option>
        </select>
        <button onClick={load} className="text-sm font-medium text-brass-dark hover:text-brass ml-auto">
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-4 py-3 mb-6">{error}</p>
      )}

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-ink/50 text-sm">No feedback matches this filter.</p>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="bg-white/60 border border-brass/20 rounded-sm p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="font-medium text-ink/90">{f.full_name}</div>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < f.rating ? "#B08D57" : "none"} stroke="#B08D57" strokeWidth="1.5">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" strokeLinejoin="round" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                  f.approved ? "bg-pine text-sand-light" : "bg-sand text-pine-dark"
                }`}>
                  {f.approved ? "Approved" : "Pending"}
                </span>
              </div>
              <p className="text-sm text-ink/75 leading-relaxed mb-2">"{f.message}"</p>
              <div className="text-xs text-ink/40 mb-3">
                {f.occasion && <span className="capitalize">{f.occasion} · </span>}
                {f.reference && <span>{f.reference} · </span>}
                {f.created_at}
              </div>
              <div className="flex gap-2">
                {!f.approved ? (
                  <button
                    onClick={() => setApproved(f.id, true)}
                    className="text-xs font-medium bg-pine text-sand-light px-3 py-1.5 rounded-sm hover:bg-pine-dark"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => setApproved(f.id, false)}
                    className="text-xs font-medium border border-brass/30 text-pine px-3 py-1.5 rounded-sm hover:bg-sand"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={() => remove(f.id)}
                  className="text-xs font-medium text-red-700 border border-red-200 px-3 py-1.5 rounded-sm hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
