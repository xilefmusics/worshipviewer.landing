"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
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
  applyAppearancePreference,
  readAppearancePreference,
  writeAppearancePreference,
  type AppearancePreference,
} from "@/lib/appearance";
import { cn } from "@/lib/utils";

function resolveTheme(
  preference: AppearancePreference,
): "light" | "dark" {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function AppearanceToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [preference, setPreference] = useState<AppearancePreference>(() =>
    typeof globalThis.window === "undefined"
      ? "system"
      : readAppearancePreference(),
  );
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const syncTheme = () => {
      setResolvedTheme(resolveTheme(readAppearancePreference()));
    };

    syncTheme();

    const media = globalThis.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", syncTheme);

    const observer = new MutationObserver(syncTheme);
    observer.observe(globalThis.document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      media.removeEventListener("change", syncTheme);
      observer.disconnect();
    };
  }, [preference]);

  function handleChange(next: AppearancePreference) {
    setPreference(next);
    writeAppearancePreference(next);
    applyAppearancePreference(next);
    setResolvedTheme(resolveTheme(next));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("relative", className)}
          aria-label={t("preferences.appearanceLabel")}
        >
          <Sun
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all",
              resolvedTheme === "dark" &&
                "scale-0 -rotate-90 opacity-0 absolute",
            )}
          />
          <Moon
            className={cn(
              "h-[1.2rem] w-[1.2rem] transition-all",
              resolvedTheme === "light" &&
                "scale-0 rotate-90 opacity-0 absolute",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) =>
            handleChange(value as AppearancePreference)
          }
        >
          <DropdownMenuRadioItem value="light">
            {t("preferences.appearanceLight")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            {t("preferences.appearanceDark")}
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            {t("preferences.appearanceSystem")}
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
