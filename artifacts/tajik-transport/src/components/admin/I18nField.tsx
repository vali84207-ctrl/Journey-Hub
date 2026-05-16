import { useState } from "react";
import type { LangMap } from "@/lib/locale";

type Code = "ru" | "tj" | "uz";
const LANGS: { code: Code; label: string }[] = [
  { code: "ru", label: "RU" },
  { code: "tj", label: "TJ" },
  { code: "uz", label: "UZ" },
];

const inputCls =
  "w-full bg-black border border-white/10 px-3 py-2 text-white text-sm focus:border-primary focus:outline-none";

export function I18nField({
  value,
  onChange,
  multiline,
  rows = 3,
  enPreview,
}: {
  value: LangMap | undefined | null;
  onChange: (v: LangMap) => void;
  multiline?: boolean;
  rows?: number;
  enPreview?: string;
}) {
  const v: LangMap = value ?? {};
  const [tab, setTab] = useState<Code>("ru");
  const set = (code: Code, text: string) => {
    const next: LangMap = { ...v };
    if (text.trim() === "") delete next[code];
    else next[code] = text;
    onChange(next);
  };
  return (
    <div className="border border-white/10 bg-black/40 p-2 mt-1">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 mr-2">
          Translations
        </span>
        {LANGS.map((l) => {
          const filled = (v[l.code] ?? "").trim().length > 0;
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
        {enPreview !== undefined && (
          <span className="ml-auto text-[10px] text-gray-600 truncate max-w-[40%]">
            EN: {enPreview || "(empty)"}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea
          value={v[tab] ?? ""}
          onChange={(e) => set(tab, e.target.value)}
          rows={rows}
          className={inputCls}
          placeholder={`Translation (${tab.toUpperCase()})`}
        />
      ) : (
        <input
          value={v[tab] ?? ""}
          onChange={(e) => set(tab, e.target.value)}
          className={inputCls}
          placeholder={`Translation (${tab.toUpperCase()})`}
        />
      )}
    </div>
  );
}
