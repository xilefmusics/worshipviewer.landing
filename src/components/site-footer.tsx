"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();

  const legalLinks = [
    { href: "/imprint", label: t("footer.imprint") },
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/terms", label: t("footer.terms") },
  ];

  return (
    <footer
      id="legal"
      className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/50 px-6 py-10 text-sm text-[var(--color-muted-foreground)]"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="md:flex-1">{t("footer.tagline")}</p>
        <nav className="flex flex-wrap gap-4 md:flex-1 md:flex-nowrap md:justify-end md:gap-6">
          {legalLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="underline underline-offset-2 hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
