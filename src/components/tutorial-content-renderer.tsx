import Image from "next/image";

import { ChordExamplesPlayer } from "@/components/chord-examples-player";
import { ChordPlayer } from "@/components/chord-player";
import { ChordStaff } from "@/components/chord-staff";
import { CircleOfFifthsSimulator } from "@/components/circle-of-fifths-simulator";
import { HarmonicSimulator } from "@/components/harmonic-simulator";
import { MajorMinorPlayer } from "@/components/major-minor-player";
import { IntervalSimulator } from "@/components/interval-simulator";
import { ScaleSimulator } from "@/components/scale-simulator";
import { ToneSimulator } from "@/components/tone-simulator";
import type { TutorialEntry } from "@/lib/tutorial-content";
import { cn } from "@/lib/utils";

function renderInlineText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-[var(--color-muted)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-foreground)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

export function TutorialContentRenderer({ entries }: { entries: TutorialEntry[] }) {
  return (
    <div className="space-y-6">
      {entries.map((entry, index) => {
        if (entry.type === "heading") {
          const HeadingTag = entry.level === 2 ? "h2" : "h3";

          return (
            <HeadingTag
              key={entry.id}
              id={entry.id}
              className={cn(
                "scroll-mt-8 font-semibold",
                entry.level === 2
                  ? "pt-4 text-2xl first:pt-0"
                  : "pt-2 text-xl",
              )}
            >
              {entry.text}
            </HeadingTag>
          );
        }

        if (entry.type === "paragraph") {
          return (
            <p
              key={`paragraph-${index}`}
              className="leading-7 text-[var(--color-muted-foreground)]"
            >
              {renderInlineText(entry.text)}
            </p>
          );
        }

        if (entry.type === "table") {
          return (
            <div
              key={`table-${index}`}
              className="overflow-x-auto rounded-lg border border-[var(--color-border)]"
            >
              <table className="w-full text-sm">
                <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/30">
                  <tr>
                    {entry.headers.map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left font-medium text-[var(--color-foreground)]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {entry.rows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-[var(--color-border)] last:border-b-0"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-3 text-[var(--color-muted-foreground)]"
                        >
                          {renderInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (entry.type === "chord-staff") {
          return (
            <div key={`chord-staff-${index}`} className="space-y-3">
              <ChordStaff chords={entry.chords} />
              {entry.playback ? <ChordPlayer chords={entry.chords} /> : null}
            </div>
          );
        }

        if (entry.type === "image") {
          return (
            <figure key={`image-${index}`} className="space-y-2">
              <Image
                src={entry.src}
                alt={entry.alt}
                width={960}
                height={540}
                className={cn(
                  "h-auto rounded-lg border border-[var(--color-border)]",
                  entry.width === "half" ? "w-1/2 min-w-[12rem]" : "w-full",
                )}
              />
            </figure>
          );
        }

        if (entry.type === "scale-simulator") {
          return (
            <ScaleSimulator
              key={`scale-simulator-${index}`}
              readOnly={entry.readOnly}
              preset={entry.preset}
            />
          );
        }

        if (entry.type === "major-minor-player") {
          return <MajorMinorPlayer key={`major-minor-player-${index}`} />;
        }

        if (entry.type === "chord-examples-player") {
          return (
            <ChordExamplesPlayer
              key={`chord-examples-player-${index}`}
              chords={entry.chords}
            />
          );
        }

        if (entry.type === "tone-simulator") {
          return <ToneSimulator key={`tone-simulator-${index}`} />;
        }

        if (entry.type === "harmonic-simulator") {
          return <HarmonicSimulator key={`harmonic-simulator-${index}`} />;
        }

        if (entry.type === "interval-simulator") {
          return <IntervalSimulator key={`interval-simulator-${index}`} />;
        }

        if (entry.type === "circle-of-fifths-simulator") {
          return (
            <CircleOfFifthsSimulator
              key={`circle-of-fifths-simulator-${index}`}
            />
          );
        }

        return (
          <div key={`audio-${index}`} className="space-y-2">
            <p className="text-sm font-medium">{entry.label}</p>
            <audio controls preload="none" className="w-full">
              <source src={entry.src} />
            </audio>
          </div>
        );
      })}
    </div>
  );
}
