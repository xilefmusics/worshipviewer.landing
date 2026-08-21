"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { FeatureCards } from "@/components/feature-cards";
import { StoryDiagram } from "@/components/story-diagram";
import { SupportCards } from "@/components/support-cards";
import { Button } from "@/components/ui/button";

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

      <FeatureCards />

      <StoryDiagram />

      <SupportCards />
    </main>
  );
}
