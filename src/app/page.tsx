"use client";

import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { StoryDiagram } from "@/components/story-diagram";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const featureKeys = [
  "singleSource",
  "preparedYetFree",
  "allForHisGlory",
] as const;

const supportKeys = [
  "praying",
  "feedback",
  "contributing",
  "spreadTheWord",
  "financial",
] as const;

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="max-w-3xl space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
          {t("hero.eyebrow")}
        </p>
        <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="text-lg text-[var(--color-muted-foreground)]">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button asChild size="lg">
            <Link href="https://app.worshipviewer.com">
              {t("nav.goToLogin")}
            </Link>
          </Button>
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
            {t("hero.joinFree")}
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {featureKeys.map((key) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-xl">
                {t(`features.${key}.title`)}
              </CardTitle>
              <CardDescription>
                {t(`features.${key}.description`)}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <StoryDiagram />

      <section className="space-y-6">
        <div className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
            {t("support.eyebrow")}
          </p>
          <h2 className="text-balance text-3xl font-semibold">
            {t("support.title")}
          </h2>
          <p className="text-base text-[var(--color-muted-foreground)]">
            {t("support.description")}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {supportKeys.map((key) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-xl">
                  {t(`support.${key}.title`)}
                </CardTitle>
                <CardDescription>
                  {key === "feedback" || key === "financial" ? (
                    <Trans
                      i18nKey={`support.${key}.description`}
                      components={{
                        1: (
                          <Link
                            href="mailto:info@worshipviewer.com"
                            className="underline underline-offset-2 hover:text-[var(--color-foreground)]"
                          />
                        ),
                      }}
                    />
                  ) : key === "contributing" ? (
                    <Trans
                      i18nKey={`support.${key}.description`}
                      components={{
                        1: (
                          <Link
                            href="https://github.com/xilefmusics/worship_viewer"
                            className="underline underline-offset-2 hover:text-[var(--color-foreground)]"
                            target="_blank"
                            rel="noreferrer"
                          />
                        ),
                      }}
                    />
                  ) : (
                    t(`support.${key}.description`)
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
