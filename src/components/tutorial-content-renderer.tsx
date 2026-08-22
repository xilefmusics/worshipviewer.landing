import { ChevronDown } from "lucide-react";
import Image from "next/image";

import { ChordExamplesPlayer } from "@/components/chord-examples-player";
import { ChordPlayer } from "@/components/chord-player";
import { ChordStaff } from "@/components/chord-staff";
import { CircleOfFifthsSimulator } from "@/components/circle-of-fifths-simulator";
import { ComingSoonLabel } from "@/components/coming-soon-label";
import { InProgressLabel } from "@/components/in-progress-label";
import { HarmonicSimulator } from "@/components/harmonic-simulator";
import { MajorMinorPlayer } from "@/components/major-minor-player";
import { IntervalSimulator } from "@/components/interval-simulator";
import { ScaleSimulator } from "@/components/scale-simulator";
import { ToneSimulator } from "@/components/tone-simulator";
import {
  TutorialExpandableImage,
  TutorialExpandableTrigger,
} from "@/components/tutorial-expandable-image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TutorialEntry, TutorialImage } from "@/lib/tutorial-content";
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

function isTitledImage(
  entry: TutorialEntry,
): entry is TutorialImage & { title: string } {
  return entry.type === "image" && Boolean(entry.title);
}

type TutorialBlock =
  | { type: "titled-images"; entries: TutorialImage[]; startIndex: number }
  | { type: "single"; entry: TutorialEntry; index: number };

function groupTutorialEntries(entries: TutorialEntry[]): TutorialBlock[] {
  const blocks: TutorialBlock[] = [];

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];

    if (isTitledImage(entry)) {
      const titledImages: TutorialImage[] = [entry];
      const startIndex = index;

      while (index + 1 < entries.length && isTitledImage(entries[index + 1])) {
        index += 1;
        titledImages.push(entries[index] as TutorialImage);
      }

      blocks.push({
        type: "titled-images",
        entries: titledImages,
        startIndex,
      });
      continue;
    }

    blocks.push({ type: "single", entry, index });
  }

  return blocks;
}

function ChordImageCard({ entry }: { entry: TutorialImage }) {
  return (
    <Card className="border-neutral-200 bg-white text-neutral-900 shadow-none">
      <CardHeader className="p-2 pb-1 sm:p-3 sm:pb-2">
        <p className="text-center text-sm font-semibold sm:text-base">
          {entry.title}
        </p>
      </CardHeader>
      <CardContent className="p-2 pt-0 sm:p-3 sm:pt-0">
        <TutorialExpandableTrigger src={entry.src} alt={entry.alt}>
          <Image
            src={entry.src}
            alt={entry.alt}
            width={632}
            height={900}
            className="h-auto w-full"
          />
        </TutorialExpandableTrigger>
      </CardContent>
    </Card>
  );
}

export function TutorialContentRenderer({ entries }: { entries: TutorialEntry[] }) {
  const blocks = groupTutorialEntries(entries);

  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        if (block.type === "titled-images") {
          return (
            <div key={`image-grid-${block.startIndex}`} className="@container">
              <div className="grid grid-cols-2 gap-3 @min-[30rem]:grid-cols-3 @min-[54rem]:grid-cols-6">
                {block.entries.map((entry, offset) => (
                  <ChordImageCard
                    key={`image-${block.startIndex + offset}`}
                    entry={entry}
                  />
                ))}
              </div>
            </div>
          );
        }

        const { entry, index } = block;

        if (entry.type === "foldable") {
          return (
            <details
              key={`foldable-${index}`}
              className="group rounded-xl border border-[var(--color-border)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-semibold text-[var(--color-foreground)] [&::-webkit-details-marker]:hidden">
                <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {entry.title}
                  {entry.label ? (
                    <InProgressLabel>{entry.label}</InProgressLabel>
                  ) : null}
                </span>
                <ChevronDown
                  className="size-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-[var(--color-border)] px-4 py-4">
                <TutorialContentRenderer entries={entry.entries} />
              </div>
            </details>
          );
        }

        if (entry.type === "heading") {
          const HeadingTag = entry.level === 2 ? "h2" : "h3";

          return (
            <HeadingTag
              key={entry.id}
              id={entry.id}
              className={cn(
                "scroll-mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold",
                entry.level === 2
                  ? "pt-4 text-2xl first:pt-0"
                  : "pt-2 text-xl",
              )}
            >
              {entry.text}
              {entry.comingSoon ? <ComingSoonLabel /> : null}
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
            <TutorialExpandableImage key={`image-${index}`} entry={entry} />
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
