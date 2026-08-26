import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ItineraryContext = createContext(null);
const STORAGE_KEY = "kilele_itinerary_v1";

export function ItineraryProvider({ children }) {
  const [selectedIds, setSelectedIds] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds));
    } catch {
      // sessionStorage unavailable — selection just won't persist across a reload
    }
  }, [selectedIds]);

  const toggleSite = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const removeSite = useCallback((id) => {
    setSelectedIds((prev) => prev.filter((s) => s !== id));
  }, []);

  const clearItinerary = useCallback(() => setSelectedIds([]), []);

  return (
    <ItineraryContext.Provider value={{ selectedIds, toggleSite, removeSite, clearItinerary }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const ctx = useContext(ItineraryContext);
  if (!ctx) throw new Error("useItinerary must be used within ItineraryProvider");
  return ctx;
}
