const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.fieldErrors = data.errors;
    throw err;
  }
  return data;
}

export const api = {
  getOccasions: () => request("/occasions"),
  getVehicles: (category) => request(`/vehicles${category ? `?category=${encodeURIComponent(category)}` : ""}`),
  getVehicle: (id) => request(`/vehicles/${id}`),
  createQuote: (payload) =>
    request("/quotes", { method: "POST", body: JSON.stringify(payload) }),
  getQuote: (reference) => request(`/quotes/${reference}`)
};
