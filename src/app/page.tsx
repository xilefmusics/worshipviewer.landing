"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { FeatureCards } from "@/components/feature-cards";
import { SocialProof } from "@/components/social-proof";
import { StoryDiagram } from "@/components/story-diagram";
import { SupportCards } from "@/components/support-cards";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)] lg:gap-12">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            {t("hero.subtitle")}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="https://app.worshipviewer.com">
                {t("hero.primaryCta")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {t("hero.joinFree")}
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div
            className="absolute -inset-4 rounded-[2rem] bg-[var(--color-primary)]/10 blur-3xl"
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-elevated)] sm:p-3">
            <Image
              src="/wv_sheet.png"
              alt={t("hero.productImageAlt")}
              width={1024}
              height={1024}
              className="aspect-[4/3] w-full rounded-xl border border-[var(--color-border)] object-cover object-top"
              priority
            />
            <div className="px-2 pb-1 pt-3 text-xs text-[var(--color-muted-foreground)]">
              <span>{t("hero.productCaption")}</span>
            </div>
          </div>
        </div>
      </section>

      <SocialProof />

      <FeatureCards />

      <StoryDiagram />

      <SupportCards />
    </main>
  );
}
