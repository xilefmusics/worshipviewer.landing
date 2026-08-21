"use client";

import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const proofKeys = ["worshipLeader", "musician", "avTeam"] as const;

export function SocialProof() {
  const { t } = useTranslation();

  return (
    <section
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-8 sm:px-8"
      aria-labelledby="social-proof-title"
    >
      <div className="mx-auto max-w-2xl space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
          {t("socialProof.eyebrow")}
        </p>
        <h2 id="social-proof-title" className="text-balance text-2xl font-semibold">
          {t("socialProof.title")}
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {t("socialProof.description")}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {proofKeys.map((key) => (
          <article
            key={key}
            className="flex min-h-44 flex-col rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/30 p-5"
          >
            <Quote
              className="size-5 text-[var(--color-primary)]"
              aria-hidden
            />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {t(`socialProof.cards.${key}.quote`)}
            </p>
            <div className="mt-5 border-t border-[var(--color-border)] pt-4">
              <p className="text-sm font-semibold">
                {t(`socialProof.cards.${key}.role`)}
              </p>
              <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                {t("socialProof.placeholderLabel")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
