"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ComingSoonLabel } from "@/components/coming-soon-label";
import {
  getChapterForSection,
  type TutorialTocChapter,
} from "@/lib/tutorial-content";
import { cn } from "@/lib/utils";

type TutorialTableOfContentsProps = {
  chapters: TutorialTocChapter[];
  activeSectionId: string | null;
  onSectionSelect: (id: string) => void;
};

export function TutorialTableOfContents({
  chapters,
  activeSectionId,
  onSectionSelect,
}: TutorialTableOfContentsProps) {
  const { t } = useTranslation();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    if (!activeSectionId) {
      return;
    }

    const activeChapter = getChapterForSection(chapters, activeSectionId);
    if (!activeChapter || activeChapter.subsections.length === 0) {
      return;
    }

    setExpandedChapters((previous) => {
      if (previous.has(activeChapter.id)) {
        return previous;
      }

      return new Set(previous).add(activeChapter.id);
    });
  }, [activeSectionId, chapters]);

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((previous) => {
      const next = new Set(previous);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  return (
    <nav
      aria-label={t("tutorials.tableOfContents")}
      className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4 lg:sticky lg:top-8 lg:self-start"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-muted-foreground)]">
        {t("tutorials.tableOfContents")}
      </p>
      <ol className="mt-3 space-y-1">
        {chapters.map((chapter) => {
          const hasSubsections = chapter.subsections.length > 0;
          const isExpanded = expandedChapters.has(chapter.id);
          const isChapterActive =
            activeSectionId === chapter.id ||
            chapter.subsections.some(
              (subsection) => subsection.id === activeSectionId,
            );

          return (
            <li key={chapter.id}>
              <div className="flex items-start gap-0.5">
                {hasSubsections ? (
                  <button
                    type="button"
                    onClick={() => toggleChapter(chapter.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`toc-section-${chapter.id}`}
                    aria-label={
                      isExpanded
                        ? t("tutorials.collapseChapter", { chapter: chapter.text })
                        : t("tutorials.expandChapter", { chapter: chapter.text })
                    }
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                  >
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform",
                        isExpanded && "rotate-90",
                      )}
                      aria-hidden
                    />
                  </button>
                ) : (
                  <span className="w-7 shrink-0" aria-hidden />
                )}

                <a
                  href={`#${chapter.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onSectionSelect(chapter.id);
                  }}
                  className={cn(
                    "block min-w-0 flex-1 rounded-md px-2 py-1.5 text-sm leading-snug transition-colors",
                    activeSectionId === chapter.id
                      ? "bg-[var(--color-primary)]/10 font-medium text-[var(--color-primary)]"
                      : isChapterActive
                        ? "font-medium text-[var(--color-foreground)]"
                        : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                  )}
                  aria-current={
                    activeSectionId === chapter.id ? "location" : undefined
                  }
                >
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {chapter.text}
                    {chapter.comingSoon ? (
                      <ComingSoonLabel className="px-2 py-px text-[0.65rem] tracking-[0.1em]" />
                    ) : null}
                  </span>
                </a>
              </div>

              {hasSubsections && isExpanded ? (
                <ol
                  id={`toc-section-${chapter.id}`}
                  className="ml-7 mt-1 space-y-1 border-l border-[var(--color-border)] pl-2"
                >
                  {chapter.subsections.map((subsection) => {
                    const isActive = subsection.id === activeSectionId;

                    return (
                      <li key={subsection.id}>
                        <a
                          href={`#${subsection.id}`}
                          onClick={(event) => {
                            event.preventDefault();
                            onSectionSelect(subsection.id);
                          }}
                          className={cn(
                            "block rounded-md px-2 py-1.5 text-sm leading-snug transition-colors",
                            isActive
                              ? "bg-[var(--color-primary)]/10 font-medium text-[var(--color-primary)]"
                              : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
                          )}
                          aria-current={isActive ? "location" : undefined}
                        >
                          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            {subsection.text}
                            {subsection.comingSoon ? (
                              <ComingSoonLabel className="px-2 py-px text-[0.65rem] tracking-[0.1em]" />
                            ) : null}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
