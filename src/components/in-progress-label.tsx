"use client";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export function InProgressLabel({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]",
        className,
      )}
    >
      {t("tutorials.inProgress")}
    </span>
  );
}
