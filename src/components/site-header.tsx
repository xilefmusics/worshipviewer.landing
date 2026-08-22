"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { AppearancePreferenceMenu } from "@/components/appearance-toggle";
import { LanguagePreferenceMenu } from "@/components/language-toggle";
import { PreferenceSwitchers } from "@/components/preference-switchers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/tutorials", labelKey: "nav.tutorials" },
] as const;

export function SiteHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <Image
            src="/brand/favicon.png"
            alt=""
            width={112}
            height={112}
            className="h-9 w-auto shrink-0 object-contain sm:h-12 md:h-14"
            priority
          />
          <span className="min-w-0">
            <Image
              src="/brand/wordmark.png"
              alt="Worship Viewer"
              width={900}
              height={400}
              className="h-9 w-auto max-w-full object-contain object-left md:h-11"
              priority
            />
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-3 md:flex" aria-label={t("nav.menu")}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Button
                  key={link.href}
                  variant="outline"
                  asChild
                  className={cn(isActive && "bg-[var(--color-muted)]")}
                >
                  <Link href={link.href} aria-current={isActive ? "page" : undefined}>
                    {t(link.labelKey)}
                  </Link>
                </Button>
              );
            })}
          </nav>

          <PreferenceSwitchers className="hidden md:inline-flex" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label={t("nav.openMenu")}
              >
                <Menu className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "cursor-pointer",
                        isActive && "bg-[var(--color-muted)]",
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t("preferences.languageLabel")}</DropdownMenuLabel>
              <LanguagePreferenceMenu />
              <DropdownMenuSeparator />
              <DropdownMenuLabel>{t("preferences.appearanceLabel")}</DropdownMenuLabel>
              <AppearancePreferenceMenu />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild>
            <Link href="https://app.worshipviewer.com">{t("nav.login")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
