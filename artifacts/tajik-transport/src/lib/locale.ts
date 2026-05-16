export type LangCode = "en" | "ru" | "tj" | "uz";

export type LangMap = {
  ru?: string;
  tj?: string;
  uz?: string;
};

export type LocalizedObject = {
  en?: string;
  ru?: string;
  tj?: string;
  uz?: string;
};

export type LocalizedString = string | LocalizedObject;

export function pickI18n(
  baseEn: string | null | undefined,
  i18n: LangMap | null | undefined,
  lang: string,
): string {
  const base = baseEn ?? "";
  if (!lang || lang === "en") return base;
  const key = lang as keyof LangMap;
  const v = i18n?.[key];
  return v && v.trim().length > 0 ? v : base;
}

export function pickLocale(
  value: LocalizedString | null | undefined,
  lang: string,
): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const en = value.en ?? "";
  if (!lang || lang === "en") return en;
  const key = lang as keyof LocalizedObject;
  const v = value[key];
  return v && v.trim().length > 0 ? v : en;
}

export function pickLocaleArray(
  values: LocalizedString[] | null | undefined,
  lang: string,
): string[] {
  return (values ?? []).map((v) => pickLocale(v, lang));
}

export function useActiveLang(i18nLang: string): LangCode {
  const base = (i18nLang || "en").split("-")[0].toLowerCase();
  if (base === "ru" || base === "tj" || base === "uz") return base;
  return "en";
}
