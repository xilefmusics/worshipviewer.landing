"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const carouselSlideKeys = ["planning", "import", "more"] as const;

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
  const [activeSlide, setActiveSlide] = useState(0);

  const carouselSlides = useMemo(
    () =>
      carouselSlideKeys.map((key) => ({
        key,
        src:
          key === "planning"
            ? "/screenshot1.png"
            : key === "import"
              ? "/screenshot2.png"
              : "/more-to-come.svg",
        alt: t(`carousel.slides.${key}.alt`),
        caption: t(`carousel.slides.${key}.caption`),
      })),
    [t],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [carouselSlides.length]);

  const goToSlide = (index: number) => {
    const normalizedIndex =
      (index + carouselSlides.length) % carouselSlides.length;
    setActiveSlide(normalizedIndex);
  };

  const handlePrev = () => goToSlide(activeSlide - 1);
  const handleNext = () => goToSlide(activeSlide + 1);

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-6">
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
        </div>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>{t("carousel.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/40">
              <Image
                key={carouselSlides[activeSlide].src}
                src={carouselSlides[activeSlide].src}
                alt={carouselSlides[activeSlide].alt}
                width={960}
                height={640}
                className="h-64 w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-bg)]/90 to-transparent px-4 py-3">
                <p className="text-sm font-medium">
                  {t("carousel.slideIndicator", {
                    current: activeSlide + 1,
                    total: carouselSlides.length,
                  })}
                </p>
              </div>

              <div className="absolute inset-y-0 left-0 flex items-center p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  type="button"
                  aria-label={t("carousel.prevAria")}
                >
                  {t("carousel.prev")}
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center p-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  type="button"
                  aria-label={t("carousel.nextAria")}
                >
                  {t("carousel.next")}
                </Button>
              </div>
            </div>

            <p
              className="text-sm text-[var(--color-muted-foreground)]"
              aria-live="polite"
            >
              {carouselSlides[activeSlide].caption}
            </p>

            <div className="flex items-center justify-center gap-2">
              {carouselSlides.map((slide, index) => {
                const isActive = index === activeSlide;
                return (
                  <button
                    key={slide.key}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={t("carousel.goToSlide", { index: index + 1 })}
                    className={`h-2.5 w-2.5 rounded-full transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)]"
                        : "bg-[var(--color-muted-foreground)]/40"
                    }`}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
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
