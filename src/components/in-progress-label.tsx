"use client";

import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

export function InProgressLabel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-primary)]",
        className,
      )}
    >
      {children ?? t("tutorials.inProgress")}
    </span>
  );
}
