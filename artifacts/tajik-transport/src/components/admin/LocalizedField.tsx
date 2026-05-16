import { useState } from "react";
import type { LocalizedString, LocalizedObject, LangCode } from "@/lib/locale";

const LANGS: { code: LangCode; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "tj", label: "TJ" },
  { code: "uz", label: "UZ" },
];

const inputCls =
  "w-full bg-black border border-white/10 px-3 py-2 text-white text-sm focus:border-primary focus:outline-none";

function toObject(v: LocalizedString | undefined | null): LocalizedObject {
  if (v == null) return {};
  if (typeof v === "string") return { en: v };
  return v;
}

export function LocalizedField({
  value,
  onChange,
  multiline,
  rows = 3,
  placeholder,
  required,
  label,
  compact,
}: {
  value: LocalizedString | undefined | null;
  onChange: (v: LocalizedString) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  label?: string;
  compact?: boolean;
}) {
  const obj = toObject(value);
  const [tab, setTab] = useState<LangCode>("en");
  const set = (code: LangCode, text: string) => {
    const next: LocalizedObject = { ...obj };
    if (text === "" && code !== "en") {
      delete next[code];
    } else {
      next[code] = text;
    }
    onChange(next);
  };
  return (
    <div className={compact ? "" : "border border-white/10 bg-black/40 p-2"}>
      <div className="flex items-center gap-1 mb-2">
        {label && (
          <span className="text-[10px] uppercase tracking-wider text-gray-400 mr-2">
            {label}
          </span>
        )}
        {LANGS.map((l) => {
          const filled = (obj[l.code] ?? "").trim().length > 0;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setTab(l.code)}
              className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${
                tab === l.code
                  ? "border-primary text-primary bg-primary/10"
                  : "border-white/15 text-gray-400 hover:text-white"
              }`}
            >
              {l.label}
              {filled && <span className="ml-1 text-primary">•</span>}
            </button>
          );
        })}
      </div>
      {multiline ? (
        <textarea
          value={obj[tab] ?? ""}
          onChange={(e) => set(tab, e.target.value)}
          rows={rows}
          required={required && tab === "en"}
          className={inputCls}
          placeholder={placeholder}
        />
      ) : (
        <input
          value={obj[tab] ?? ""}
          onChange={(e) => set(tab, e.target.value)}
          required={required && tab === "en"}
          className={inputCls}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
