import Image from "next/image";

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
          return <ScaleSimulator key={`scale-simulator-${index}`} />;
        }

        if (entry.type === "tone-simulator") {
          return <ToneSimulator key={`tone-simulator-${index}`} />;
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
