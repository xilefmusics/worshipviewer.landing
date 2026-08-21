"use client";

import { useTranslation } from "react-i18next";

import { ExpandableCard } from "@/components/expandable-card";
import { useExpandableCards } from "@/lib/use-expandable-cards";

const featureKeys = [
  "singleSource",
  "preparedYetFree",
  "allForHisGlory",
] as const;

export function FeatureCards() {
  const { t } = useTranslation();
  const { openId, prefersHover, onToggle, onHover } = useExpandableCards();

  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
          {t("features.eyebrow")}
        </p>
        <h2 className="text-balance text-3xl font-semibold">
          {t("features.title")}
        </h2>
        <p className="text-base text-[var(--color-muted-foreground)]">
          {t("features.description")}
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-3">
        {featureKeys.map((key) => {
          const description = t(`features.${key}.description`, {
            returnObjects: true,
          });
          const paragraphs = Array.isArray(description)
            ? description.filter((item): item is string => typeof item === "string")
            : [String(description)];

          return (
            <ExpandableCard
              key={key}
              id={key}
              title={t(`features.${key}.title`)}
              open={openId === key}
              prefersHover={prefersHover}
              onToggle={onToggle}
              onHover={onHover}
            >
              <div className="space-y-3">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ExpandableCard>
          );
        })}
      </div>
    </section>
  );
}
