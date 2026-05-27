"use client";

import { Languages } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BROWSER_LOCALE_FLAG_KEY,
  LOCALE_STORAGE_KEY,
  mapLanguagesToLocale,
  resolveLocalePreference,
  type AppLocale,
  type LocalePreference,
} from "@/lib/locale";
import { cn } from "@/lib/utils";

function readLocalePreference(): LocalePreference {
  if (typeof globalThis.window === "undefined") return "browser";
  return resolveLocalePreference(
    globalThis.localStorage.getItem(LOCALE_STORAGE_KEY),
    globalThis.localStorage.getItem(BROWSER_LOCALE_FLAG_KEY),
  );
}

export function LanguageToggle({ className }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const [preference, setPreference] = useState<LocalePreference>(() =>
    typeof globalThis.window === "undefined"
      ? "browser"
      : readLocalePreference(),
  );

  async function handleChange(next: LocalePreference) {
    setPreference(next);

    if (next === "browser") {
      globalThis.localStorage.setItem(BROWSER_LOCALE_FLAG_KEY, "1");
      globalThis.localStorage.removeItem(LOCALE_STORAGE_KEY);
      const locale = mapLanguagesToLocale(globalThis.navigator.languages);
      await i18n.changeLanguage(locale);
      globalThis.document.documentElement.lang = locale;
      return;
    }

    const locale: AppLocale = next;
    globalThis.localStorage.removeItem(BROWSER_LOCALE_FLAG_KEY);
    globalThis.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    await i18n.changeLanguage(locale);
    globalThis.document.documentElement.lang = locale;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(className)}
          aria-label={t("preferences.languageLabel")}
        >
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) =>
            void handleChange(value as LocalePreference)
          }
        >
          <DropdownMenuRadioItem value="browser">
            {t("preferences.languageBrowser")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">
            {t("preferences.languageEn")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="de">
            {t("preferences.languageDe")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
