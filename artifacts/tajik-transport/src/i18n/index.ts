import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { en } from "./locales/en";
import { ru } from "./locales/ru";
import { tj } from "./locales/tj";
import { uz } from "./locales/uz";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "tj", label: "TJ", name: "Тоҷикӣ" },
  { code: "uz", label: "UZ", name: "O'zbekcha" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      tj: { translation: tj },
      uz: { translation: uz },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "pld_lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
