"use client";

import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";

import { ExpandableCard } from "@/components/expandable-card";
import { useExpandableCards } from "@/lib/use-expandable-cards";

const supportKeys = [
  "praying",
  "feedback",
  "contributing",
  "spreadTheWord",
  "financial",
] as const;

const linkClassName =
  "underline underline-offset-2 hover:text-[var(--color-foreground)]";

function SupportDescription({
  supportKey,
}: {
  supportKey: (typeof supportKeys)[number];
}) {
  const { t } = useTranslation();

  if (supportKey === "feedback" || supportKey === "financial") {
    return (
      <p>
        <Trans
          i18nKey={`support.${supportKey}.description`}
          components={{
            1: (
              <Link
                href="mailto:info@worshipviewer.com"
                className={linkClassName}
              />
            ),
          }}
        />
      </p>
    );
  }

  if (supportKey === "contributing") {
    return (
      <p>
        <Trans
          i18nKey={`support.${supportKey}.description`}
          components={{
            1: (
              <Link
                href="https://github.com/xilefmusics/worship_viewer"
                className={linkClassName}
                target="_blank"
                rel="noreferrer"
              />
            ),
          }}
        />
      </p>
    );
  }

  return <p>{t(`support.${supportKey}.description`)}</p>;
}

export function SupportCards() {
  const { t } = useTranslation();
  const { openId, prefersHover, onToggle, onHover } = useExpandableCards();

  return (
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
      <div className="grid items-start gap-6 md:grid-cols-3">
        {supportKeys.map((key) => (
          <ExpandableCard
            key={key}
            id={key}
            title={t(`support.${key}.title`)}
            open={openId === key}
            prefersHover={prefersHover}
            onToggle={onToggle}
            onHover={onHover}
          >
            <SupportDescription supportKey={key} />
          </ExpandableCard>
        ))}
      </div>
    </section>
  );
}
