export type TutorialMeta = {
  slug: string;
  date: string;
  status?: "inProgress";
};

export const tutorials: TutorialMeta[] = [
  {
    slug: "music-theory-for-worshippers",
    date: "2026-05-27",
    status: "inProgress",
  },
  {
    slug: "getting-started",
    date: "2025-05-27",
    status: "inProgress",
  },
];

export const tutorialSlugs = tutorials.map((tutorial) => tutorial.slug);

export function getTutorial(slug: string): TutorialMeta | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}
