import { musicTheoryForWorshippers } from "@/content/tutorials/music-theory-for-worshippers";

export type TutorialHeading = {
  type: "heading";
  id: string;
  text: string;
  level: 2 | 3;
  comingSoon?: boolean;
};

export type TutorialParagraph = {
  type: "paragraph";
  text: string;
};

export type TutorialTable = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type TutorialChordStaff = {
  type: "chord-staff";
  chords: Array<{
    label: string;
    notes: Array<
      | string
      | {
          note: string;
          headSide?: "left" | "right";
        }
    >;
  }>;
  playback?: boolean;
};

export type TutorialImage = {
  type: "image";
  src: string;
  alt: string;
  width?: "full" | "half";
};

export type TutorialAudio = {
  type: "audio";
  label: string;
  src: string;
};

export type TutorialScaleSimulator = {
  type: "scale-simulator";
  readOnly?: boolean;
  preset?: "major";
};

export type TutorialMajorMinorPlayer = {
  type: "major-minor-player";
};

export type TutorialChordExamplesPlayer = {
  type: "chord-examples-player";
  chords: Array<{
    label: string;
    notes: string[];
  }>;
};

export type TutorialToneSimulator = {
  type: "tone-simulator";
};

export type TutorialHarmonicSimulator = {
  type: "harmonic-simulator";
};

export type TutorialIntervalSimulator = {
  type: "interval-simulator";
};

export type TutorialCircleOfFifthsSimulator = {
  type: "circle-of-fifths-simulator";
};

export type TutorialEntry =
  | TutorialHeading
  | TutorialParagraph
  | TutorialTable
  | TutorialChordStaff
  | TutorialImage
  | TutorialAudio
  | TutorialScaleSimulator
  | TutorialToneSimulator
  | TutorialHarmonicSimulator
  | TutorialIntervalSimulator
  | TutorialCircleOfFifthsSimulator
  | TutorialMajorMinorPlayer
  | TutorialChordExamplesPlayer;

export type TutorialTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
  comingSoon?: boolean;
};

export type TutorialTocChapter = {
  id: string;
  text: string;
  comingSoon?: boolean;
  subsections: TutorialTocItem[];
};

const contentBySlug: Record<string, TutorialEntry[]> = {
  "music-theory-for-worshippers": musicTheoryForWorshippers,
};

export function normalizeTutorialEntries(
  entries: TutorialEntry[],
): TutorialEntry[] {
  const normalized: TutorialEntry[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraphs = () => {
    if (paragraphBuffer.length === 0) {
      return;
    }

    normalized.push({
      type: "paragraph",
      text: paragraphBuffer.join(" "),
    });
    paragraphBuffer = [];
  };

  for (const entry of entries) {
    if (entry.type === "paragraph") {
      paragraphBuffer.push(entry.text);
      continue;
    }

    flushParagraphs();
    normalized.push(entry);
  }

  flushParagraphs();
  return normalized;
}

export function getTutorialContent(slug: string): TutorialEntry[] | undefined {
  const entries = contentBySlug[slug];
  return entries ? normalizeTutorialEntries(entries) : undefined;
}

export function getTutorialToc(entries: TutorialEntry[]): TutorialTocItem[] {
  return entries
    .filter((entry): entry is TutorialHeading => entry.type === "heading")
    .map(({ id, text, level, comingSoon }) => ({
      id,
      text,
      level,
      comingSoon,
    }));
}

export function getTutorialTocChapters(
  items: TutorialTocItem[],
): TutorialTocChapter[] {
  const chapters: TutorialTocChapter[] = [];

  for (const item of items) {
    if (item.level === 2) {
      chapters.push({
        id: item.id,
        text: item.text,
        comingSoon: item.comingSoon,
        subsections: [],
      });
      continue;
    }

    const currentChapter = chapters.at(-1);
    if (currentChapter) {
      currentChapter.subsections.push(item);
    }
  }

  return chapters;
}

export function getChapterForSection(
  chapters: TutorialTocChapter[],
  sectionId: string,
): TutorialTocChapter | undefined {
  return chapters.find(
    (chapter) =>
      chapter.id === sectionId ||
      chapter.subsections.some((subsection) => subsection.id === sectionId),
  );
}

export function tutorialEntriesFromLegacySections(
  sections: Array<{ heading: string; body: string }>,
): TutorialEntry[] {
  return sections.flatMap((section, index) => [
    {
      type: "heading" as const,
      id: `section-${index}`,
      text: section.heading,
      level: 2 as const,
    },
    { type: "paragraph" as const, text: section.body },
  ]);
}
