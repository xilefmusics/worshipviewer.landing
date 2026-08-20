"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InProgressLabel } from "@/components/in-progress-label";
import { tutorials } from "@/lib/tutorials";

function formatPublishedDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(date),
  );
}

export default function TutorialsPage() {
  const { t, i18n } = useTranslation();
  const sortedTutorials = [...tutorials].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-16">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
          {t("tutorials.eyebrow")}
        </p>
        <h1 className="text-balance text-4xl font-semibold">
          {t("tutorials.title")}
        </h1>
        <p className="text-lg text-[var(--color-muted-foreground)]">
          {t("tutorials.description")}
        </p>
      </header>

      {sortedTutorials.length === 0 ? (
        <p className="text-[var(--color-muted-foreground)]">
          {t("tutorials.empty")}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedTutorials.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className="group block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              <Card className="transition-colors group-hover:border-[var(--color-primary)]/40">
                <CardHeader>
                  {tutorial.status === "inProgress" ? (
                    <InProgressLabel />
                  ) : (
                    <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
                      {t("tutorials.publishedOn", {
                        date: formatPublishedDate(tutorial.date, i18n.language),
                      })}
                    </p>
                  )}
                  <CardTitle className="text-2xl group-hover:text-[var(--color-primary)]">
                    {t(`tutorials.posts.${tutorial.slug}.title`)}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {t(`tutorials.posts.${tutorial.slug}.excerpt`)}
                  </CardDescription>
                  <p className="pt-1 text-sm font-medium text-[var(--color-primary)]">
                    {t("tutorials.readMore")} →
                  </p>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
