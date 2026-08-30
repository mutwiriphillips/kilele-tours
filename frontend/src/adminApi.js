const BASE = "/api";
const TOKEN_KEY = "kilele_admin_token";

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...options
  });

  if (res.status === 401) {
    setToken(null);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

export const adminApi = {
  async login(password) {
    const data = await request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });
    setToken(data.token);
    return data;
  },
  async logout() {
    try {
      await request("/admin/logout", { method: "POST" });
    } finally {
      setToken(null);
    }
  },
  isLoggedIn: () => Boolean(getToken()),
  listQuotes: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.set("status", filters.status);
    if (filters.tier) params.set("tier", filters.tier);
    const qs = params.toString();
    return request(`/admin/quotes${qs ? `?${qs}` : ""}`);
  },
  getQuote: (id) => request(`/admin/quotes/${id}`),
  updateStatus: (id, status) =>
    request(`/admin/quotes/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  sendQuote: (id, { price, message }) =>
    request(`/admin/quotes/${id}/quote`, { method: "POST", body: JSON.stringify({ price, message }) }),
  listPayments: (id) => request(`/admin/quotes/${id}/payments`),
  recordPayment: (id, payload) =>
    request(`/admin/quotes/${id}/payments`, { method: "POST", body: JSON.stringify(payload) }),
  listFeedback: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.approved !== undefined && filters.approved !== "") params.set("approved", filters.approved);
    const qs = params.toString();
    return request(`/admin/feedback${qs ? `?${qs}` : ""}`);
  },
  moderateFeedback: (id, approved) =>
    request(`/admin/feedback/${id}`, { method: "PATCH", body: JSON.stringify({ approved }) }),
  deleteFeedback: (id) => request(`/admin/feedback/${id}`, { method: "DELETE" })
};
