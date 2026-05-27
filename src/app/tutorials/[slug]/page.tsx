import { TutorialArticle } from "@/components/tutorial-article";
import { tutorialSlugs } from "@/lib/tutorials";

export function generateStaticParams() {
  return tutorialSlugs.map((slug) => ({ slug }));
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <TutorialArticle slug={slug} />;
}
