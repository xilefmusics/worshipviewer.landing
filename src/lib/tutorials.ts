export type TutorialMeta = {
  slug: string;
  date: string;
};

export const tutorials: TutorialMeta[] = [
  {
    slug: "music-theory-for-worshippers",
    date: "2026-05-27",
  },
  {
    slug: "getting-started",
    date: "2025-05-27",
  },
];

export const tutorialSlugs = tutorials.map((tutorial) => tutorial.slug);

export function getTutorial(slug: string): TutorialMeta | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}
