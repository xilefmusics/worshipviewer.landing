import type { Metadata } from "next";

import { PreferenceInitScript } from "@/components/preference-init-script";
import { Providers } from "@/components/providers";
import { SiteLayout } from "@/components/site-layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Worship Viewer",
  description:
    "Helps you lead worship - then steps aside when the Spirit takes over.",
  icons: {
    icon: "/brand/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PreferenceInitScript />
      </head>
      <body className="antialiased">
        <Providers>
          <SiteLayout>{children}</SiteLayout>
        </Providers>
      </body>
    </html>
  );
}
