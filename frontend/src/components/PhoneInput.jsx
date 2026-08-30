import { useState, useEffect } from "react";
import { countryCodes, countryByIso } from "../countryCodes";

/**
 * A phone input pairing a country/dial-code select with a local-number
 * field, combining them into one E.164-ish string on every change (e.g.
 * "+254 712345678"). Tourists calling in from anywhere need their own
 * country code, not just Kenya's, so this doesn't assume +254.
 */
export default function PhoneInput({ value, onChange, error, defaultIso = "KE" }) {
  const [iso, setIso] = useState(defaultIso);
  const [local, setLocal] = useState("");

  // If a full value is passed in externally (e.g. pre-fill), try to split it.
  useEffect(() => {
    if (value && !local) {
      const match = countryCodes
        .filter((c) => c.iso !== "OTHER")
        .sort((a, b) => b.dial.length - a.dial.length)
        .find((c) => value.startsWith(c.dial));
      if (match) {
        setIso(match.iso);
        setLocal(value.slice(match.dial.length).trim());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emit(nextIso, nextLocal) {
    const dial = countryByIso(nextIso)?.dial || "+";
    const cleanedLocal = nextLocal.replace(/[^\d]/g, "");
    onChange(cleanedLocal ? `${dial}${cleanedLocal}` : "", nextIso);
  }

  return (
    <div>
      <div className={`flex gap-2 rounded-sm border bg-white ${error ? "border-red-400" : "border-brass/30"} focus-within:border-brass transition-colors`}>
        <select
          value={iso}
          onChange={(e) => {
            setIso(e.target.value);
            emit(e.target.value, local);
          }}
          className="bg-transparent border-r border-brass/20 px-2 py-3 text-sm max-w-[7.5rem] focus:outline-none"
          aria-label="Country code"
        >
          {countryCodes.map((c) => (
            <option key={c.iso} value={c.iso}>
              {c.iso === "OTHER" ? "Other" : `${c.dial} ${c.iso}`}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={local}
          onChange={(e) => {
            setLocal(e.target.value);
            emit(iso, e.target.value);
          }}
          placeholder="7XX XXX XXX"
          className="flex-1 bg-transparent px-2 py-3 text-sm focus:outline-none min-w-0"
        />
      </div>
      {error && <span className="text-xs text-red-700 mt-1 block">{error}</span>}
    </div>
  );
}
