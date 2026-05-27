import { LegalPageShell } from "@/components/legal-page-shell";

export default function TermsPage() {
  return (
    <LegalPageShell
      page="terms"
      title="Allgemeine Geschäftsbedingungen (AGB)"
    >
          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">1. Geltungsbereich</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der
              App &quot;Worship Viewer&quot; (nachfolgend &quot;App&quot;) durch registrierte und
              nicht registrierte Nutzer (nachfolgend &quot;Nutzer&quot;). Abweichende
              Bedingungen der Nutzer finden keine Anwendung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">2. Anbieter</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Anbieter der App ist:
              <br />
              Felix Rollbühler
              <br />
              Münklinger Str. 2
              <br />
              75378 Bad Liebenzell
              <br />
              E-Mail: info@worshipviewer.com
            </p>
            <p className="text-sm italic text-[var(--color-muted-foreground)]">
              Die App wird privat betrieben und dient nicht kommerziellen
              Zwecken.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">3. Leistungsbeschreibung</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Der Anbieter stellt die App in der jeweils aktuellen Version zur
              Verfügung. Funktionsumfang und Verfügbarkeit können variieren. Ein
              Anspruch auf bestimmte Funktionen, eine bestimmte Verfügbarkeit
              oder Support besteht nicht.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">4. Registrierung und Konto</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Für bestimmte Funktionen ist eine Registrierung erforderlich. Die
              bei der Registrierung abgefragten Daten sind wahrheitsgemäß
              anzugeben und aktuell zu halten. Zugangsdaten sind geheim zu
              halten und vor dem Zugriff Dritter zu schützen. Der Anbieter kann
              Konten sperren oder löschen, wenn ein Missbrauch vorliegt oder
              berechtigte Gründe dafür bestehen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              5. Nutzungsregeln / Missbrauch
            </h2>
            <ul className="list-disc space-y-1 pl-5 text-[var(--color-muted-foreground)]">
              <li>
                Die App darf nur im Rahmen der geltenden Gesetze und dieser AGB
                genutzt werden.
              </li>
              <li>
                Untersagt sind insbesondere: sicherheitsrelevante Angriffe,
                automatisierte Massenanfragen, Umgehung technischer
                Schutzmaßnahmen, Veröffentlichung rechtswidriger Inhalte.
              </li>
              <li>
                Der Anbieter kann zur Sicherstellung des Betriebs angemessene
                Nutzungsbeschränkungen (z. B. Rate-Limits) einführen.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">6. Entgeltlichkeit</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Die Nutzung der App ist derzeit kostenlos. Sollte der Anbieter
              zukünftig kostenpflichtige Funktionen einführen, werden Nutzer
              hierüber vorab informiert. In diesem Fall gelten die zum Zeitpunkt
              der Einführung mitgeteilten Preise, Zahlungsbedingungen und –
              sofern einschlägig – Verbraucherinformationen (einschließlich
              Widerrufsbelehrung).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              7. Verfügbarkeit, Wartung und Änderungen
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Der Anbieter bemüht sich um einen störungsfreien Betrieb der App,
              kann jedoch Zeiten eingeschränkter Verfügbarkeit (z. B. Wartung,
              Updates, höhere Gewalt) nicht ausschließen. Der Anbieter ist
              berechtigt, Leistungen anzupassen, zu erweitern oder einzustellen,
              sofern berechtigte Interessen der Nutzer angemessen berücksichtigt
              werden.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">8. Haftung</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Der Anbieter stellt die App unentgeltlich und ohne Zusicherung
              bestimmter Funktionen oder Verfügbarkeiten bereit. Eine Haftung
              für materielle oder immaterielle Schäden, die durch die Nutzung
              oder Nichtnutzung der App entstehen, ist ausgeschlossen, soweit
              kein vorsätzliches oder grob fahrlässiges Verhalten des Anbieters
              vorliegt. Die Haftung bei Verletzung von Leben, Körper oder
              Gesundheit bleibt unberührt.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              9. Rechte an Inhalten und Software
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Sämtliche Rechte an der App, insbesondere Urheber- und
              Schutzrechte, verbleiben beim Anbieter bzw. den jeweiligen
              Rechteinhabern. Nutzern wird ein einfaches, nicht übertragbares
              Recht eingeräumt, die App im Rahmen dieser AGB zu nutzen. Eigene
              Inhalte der Nutzer dürfen nur eingestellt werden, wenn sie frei
              von Rechten Dritter sind bzw. notwendige Rechte vorliegen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">
              10. Laufzeit und Beendigung
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              Diese AGB gelten auf unbestimmte Zeit. Nutzer können die Nutzung
              jederzeit beenden und ihr Konto löschen. Der Anbieter kann
              Nutzerkonten aus wichtigem Grund sperren oder kündigen,
              insbesondere bei Verstößen gegen diese AGB oder missbräuchlicher
              Nutzung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">11. Änderungen der AGB</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Der Anbieter kann diese AGB mit Wirkung für die Zukunft ändern.
              Über wesentliche Änderungen werden Nutzer in geeigneter Form
              informiert. Widersprechen Nutzer der Änderung nicht innerhalb
              einer angemessenen Frist oder nutzen die App nach Wirksamwerden
              weiter, gelten die Änderungen als angenommen. Hierauf wird bei der
              Information gesondert hingewiesen.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">12. Datenschutz</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Informationen zur Verarbeitung personenbezogener Daten finden Sie
              in der Datenschutzerklärung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-2xl font-semibold">13. Schlussbestimmungen</h2>
            <p className="text-[var(--color-muted-foreground)]">
              Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
              des UN-Kaufrechts. Ist der Nutzer Verbraucher mit Wohnsitz in der
              EU, bleiben zwingende Verbraucherschutzvorschriften seines
              Aufenthaltsstaats unberührt. Gerichtsstand ist – soweit zulässig –
              der Sitz des Anbieters. Sollten einzelne Bestimmungen unwirksam
              sein, bleibt die Wirksamkeit der übrigen Regelungen unberührt.
            </p>
          </section>

          <p className="text-sm italic text-[var(--color-muted-foreground)]">
            Stand: 10. November 2025
          </p>
    </LegalPageShell>
  );
}

