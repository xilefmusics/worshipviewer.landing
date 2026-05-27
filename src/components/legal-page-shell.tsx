"use client";

import { useTranslation } from "react-i18next";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type LegalPageKey = "imprint" | "privacy" | "terms";

export function LegalPageShell({
  page,
  title,
  children,
}: {
  page: LegalPageKey;
  title: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex min-h-[50dvh] max-w-3xl flex-col gap-6 px-6 py-16">
      <Card className="gap-0">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
            {t(`legalPages.${page}.eyebrow`)}
          </p>
          <CardTitle className="text-4xl">{title}</CardTitle>
          <p className="text-[var(--color-muted-foreground)]">
            {t(`legalPages.${page}.intro`)}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">{children}</CardContent>
      </Card>
    </main>
  );
}
