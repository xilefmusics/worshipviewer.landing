"use client";

import { AppearanceToggle } from "@/components/appearance-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { cn } from "@/lib/utils";

export function PreferenceSwitchers({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <LanguageToggle />
      <AppearanceToggle />
    </div>
  );
}
