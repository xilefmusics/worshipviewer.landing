import { LegalPageShell } from "@/components/legal-page-shell";

export default function ImprintPage() {
  return (
    <LegalPageShell page="imprint" title="Impressum">
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              Angaben gemäß § 5 TMG
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Felix Rollbühler
              <br />
              Münklinger Str. 2
              <br />
              75378 Bad Liebenzell
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Kontakt</h2>
            <p className="text-[var(--color-muted-foreground)]">E-Mail: info@worshipviewer.com</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Felix Rollbühler
              <br />
              Münklinger Str. 2
              <br />
              75378 Bad Liebenzell
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">Hinweis</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Diese App wird privat betrieben und dient nicht kommerziellen
              Zwecken.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">EU-Streitschlichtung</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:
              <a
                className="ml-1 underline"
                href="https://consumer-redress.ec.europa.eu"
                target="_blank"
                rel="noreferrer"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              . Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              Verbraucherstreitbeilegung / Universalschlichtungsstelle
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </section>

          <p className="text-sm italic text-[var(--color-muted-foreground)]">
            Stand: 10. November 2025
          </p>
    </LegalPageShell>
  );
}

