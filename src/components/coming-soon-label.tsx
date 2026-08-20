"use client";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export function ComingSoonLabel({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)]/50 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]",
        className,
      )}
    >
      {t("tutorials.comingSoon")}
    </span>
  );
}
