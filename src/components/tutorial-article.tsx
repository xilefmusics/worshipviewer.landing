"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { TutorialContentRenderer } from "@/components/tutorial-content-renderer";
import { InProgressLabel } from "@/components/in-progress-label";
import { TutorialTableOfContents } from "@/components/tutorial-table-of-contents";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getTutorialContent,
  getTutorialToc,
  getTutorialTocChapters,
  tutorialEntriesFromLegacySections,
  type TutorialEntry,
} from "@/lib/tutorial-content";
import { getTutorial } from "@/lib/tutorials";

function formatPublishedDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(date),
  );
}

export function TutorialArticle({ slug }: { slug: string }) {
  const { t, i18n } = useTranslation();
  const tutorial = getTutorial(slug);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const entries = useMemo((): TutorialEntry[] => {
    const fromContentFile = getTutorialContent(slug);
    if (fromContentFile) {
      return fromContentFile;
    }

    const legacySections = t(`tutorials.posts.${slug}.sections`, {
      returnObjects: true,
      defaultValue: [],
    }) as Array<{ heading: string; body: string }>;

    if (Array.isArray(legacySections) && legacySections.length > 0) {
      return tutorialEntriesFromLegacySections(legacySections);
    }

    return [];
  }, [slug, t, i18n.language]);

  const toc = useMemo(() => getTutorialToc(entries), [entries]);
  const tocChapters = useMemo(() => getTutorialTocChapters(toc), [toc]);

  useEffect(() => {
    if (toc.length === 0) {
      return;
    }

    setActiveSectionId(toc[0]?.id ?? null);

    const hash = globalThis.window.location.hash.slice(1);
    if (hash && toc.some((item) => item.id === hash)) {
      const element = document.getElementById(hash);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSectionId(hash);
    }
  }, [toc, slug]);

  useEffect(() => {
    if (toc.length === 0) {
      return;
    }

    const sectionElements = toc
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visibleEntries = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio,
          );

        const topEntry = visibleEntries[0];
        if (topEntry?.target.id) {
          setActiveSectionId(topEntry.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    for (const element of sectionElements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [toc, slug]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    globalThis.window.history.replaceState(null, "", `#${id}`);
    setActiveSectionId(id);
  };

  if (!tutorial) {
    return (
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16">
        <p className="text-[var(--color-muted-foreground)]">
          {t("tutorials.notFound")}
        </p>
        <Link
          href="/tutorials"
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          ← {t("tutorials.backToList")}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/tutorials"
        className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      >
        ← {t("tutorials.backToList")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <TutorialTableOfContents
          chapters={tocChapters}
          activeSectionId={activeSectionId}
          onSectionSelect={scrollToSection}
        />

        <Card className="min-w-0 gap-0">
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
            <CardTitle className="text-4xl">
              {t(`tutorials.posts.${slug}.title`)}
            </CardTitle>
            <p className="text-lg text-[var(--color-muted-foreground)]">
              {t(`tutorials.posts.${slug}.excerpt`)}
            </p>
          </CardHeader>

          <CardContent>
            <TutorialContentRenderer entries={entries} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
