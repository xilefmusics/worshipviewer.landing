import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import de from "@/i18n/de.json";
import en from "@/i18n/en.json";
import {
  BROWSER_LOCALE_FLAG_KEY,
  LOCALE_STORAGE_KEY,
  type AppLocale,
  resolveInitialLocale,
} from "@/lib/locale";

let initialized = false;

export function initI18n(): typeof i18n {
  if (initialized) {
    return i18n;
  }

  let lng: AppLocale = "en";

  if (typeof globalThis.window !== "undefined") {
    const params = new URLSearchParams(globalThis.window.location.search);
    const stored = globalThis.localStorage.getItem(LOCALE_STORAGE_KEY);
    const browserFlag = globalThis.localStorage.getItem(BROWSER_LOCALE_FLAG_KEY);
    lng = resolveInitialLocale(
      params,
      stored,
      globalThis.navigator.languages,
      browserFlag,
    );
    globalThis.document.documentElement.lang = lng;
  }

  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });

  if (typeof globalThis.window !== "undefined") {
    i18n.on("languageChanged", (language) => {
      if (globalThis.localStorage.getItem(BROWSER_LOCALE_FLAG_KEY) === "1") {
        return;
      }
      if (language === "en" || language === "de") {
        globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, language);
      }
    });
  }

  initialized = true;
  return i18n;
}

export { i18n };
