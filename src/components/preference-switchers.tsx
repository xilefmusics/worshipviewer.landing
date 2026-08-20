"use client";

import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AppearancePreferenceMenu } from "@/components/appearance-toggle";
import { LanguagePreferenceMenu } from "@/components/language-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function PreferenceSwitchers({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(className)}
          aria-label={t("preferences.settingsLabel")}
        >
          <Settings className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("preferences.languageLabel")}</DropdownMenuLabel>
        <LanguagePreferenceMenu />
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("preferences.appearanceLabel")}</DropdownMenuLabel>
        <AppearancePreferenceMenu />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
