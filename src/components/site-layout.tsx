"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-foreground)]">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
