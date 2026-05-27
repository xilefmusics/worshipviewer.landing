/** Persisted store key — aligned with worshipviewer frontend. */
export const LOCALE_STORAGE_KEY = "i18nextLng";
export const BROWSER_LOCALE_FLAG_KEY = "wv_use_browser_locale";

export type AppLocale = "en" | "de";
export type LocalePreference = "browser" | AppLocale;

export const APP_LOCALES: readonly AppLocale[] = ["en", "de"];

export function mapLanguagesToLocale(langs: readonly string[]): AppLocale {
  for (const lang of langs) {
    const code = lang.split("-")[0]?.toLowerCase();
    if (code === "de") return "de";
    if (code === "en") return "en";
  }
  return "en";
}

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return value === "en" || value === "de";
}

export function resolveLocalePreference(
  storedLocale: string | null,
  browserFlag: string | null,
): LocalePreference {
  if (browserFlag === "1") return "browser";
  if (isAppLocale(storedLocale)) return storedLocale;
  return "browser";
}

export function resolveInitialLocale(
  searchParams: URLSearchParams,
  storedLocale: string | null,
  navigatorLanguages: readonly string[],
  browserFlag: string | null = null,
): AppLocale {
  const q = searchParams.get("lang")?.toLowerCase();
  if (isAppLocale(q)) return q;

  if (resolveLocalePreference(storedLocale, browserFlag) === "browser") {
    return mapLanguagesToLocale(navigatorLanguages);
  }

  return storedLocale as AppLocale;
}
