import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown, Check } from "lucide-react";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../i18n";

interface Props {
  variant?: "desktop" | "mobile";
}

export function LanguageSwitcher({ variant = "desktop" }: Props) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ??
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const change = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="border-b border-white/5 pb-4">
        <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-light mb-3">
          <Globe className="inline w-3 h-3 mr-2 -mt-0.5" />
          {t("nav.language")}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === current.code;
            return (
              <button
                key={lang.code}
                onClick={() => change(lang.code)}
                className={`py-2 text-xs tracking-[0.15em] uppercase border transition-all ${
                  active
                    ? "border-primary text-primary bg-primary/10"
                    : "border-white/10 text-white/70 hover:border-primary/50 hover:text-primary"
                }`}
                data-testid={`lang-mobile-${lang.code}`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-white/70 hover:text-primary transition-colors text-xs tracking-[0.15em] uppercase font-medium px-2 py-1.5"
        data-testid="lang-switcher-trigger"
      >
        <Globe size={13} className="opacity-80" />
        <span>{current.label}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 min-w-[160px] py-1 z-50 shadow-2xl"
          style={{
            background: "rgba(10,10,10,0.98)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(203,169,78,0.25)",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = lang.code === current.code;
            return (
              <button
                key={lang.code}
                onClick={() => change(lang.code)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-xs tracking-[0.12em] uppercase transition-colors ${
                  active
                    ? "text-primary bg-primary/5"
                    : "text-white/75 hover:text-primary hover:bg-white/[0.03]"
                }`}
                data-testid={`lang-option-${lang.code}`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-semibold w-6">{lang.label}</span>
                  <span className="font-light normal-case tracking-normal text-[13px]">
                    {lang.name}
                  </span>
                </span>
                {active && <Check size={12} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
