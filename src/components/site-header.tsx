"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { PreferenceSwitchers } from "@/components/preference-switchers";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <Link href="/" className="flex flex-wrap items-center gap-4 sm:gap-5">
          <Image
            src="/favicon.png"
            alt=""
            width={112}
            height={112}
            className="h-12 w-auto shrink-0 object-contain sm:h-14"
            priority
          />
          <Image
            src="/brand/logo-text.png"
            alt="Worship Viewer"
            width={900}
            height={400}
            className="h-9 w-auto max-w-[min(100%,28rem)] object-contain object-left sm:h-11"
            priority
          />
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <PreferenceSwitchers />
          <Button variant="outline" asChild>
            <Link href="/tutorials">{t("nav.tutorials")}</Link>
          </Button>
          <Button asChild>
            <Link href="https://app.worshipviewer.com">{t("nav.login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
