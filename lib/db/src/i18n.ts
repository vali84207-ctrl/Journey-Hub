export type LangCode = "en" | "ru" | "tj" | "uz";

export type LangMap = {
  ru?: string;
  tj?: string;
  uz?: string;
};

export type LocalizedString =
  | string
  | { en?: string; ru?: string; tj?: string; uz?: string };

export const EMPTY_LANG_MAP: LangMap = {};
