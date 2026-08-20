"use client";

import {
  AudioLines,
  ChevronDown,
  FileDown,
  FileMusic,
  FilePlus,
  Globe,
  ListMusic,
  LogIn,
  Presentation,
  Radio,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Users,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ComingSoonLabel } from "@/components/coming-soon-label";
import { cn } from "@/lib/utils";

/**
 * Extend this flow by adding a node to a layer. Labels, descriptions, and
 * image alts live under `story.nodes.{id}` in the i18n files.
 */
export type StoryNode = {
  id: string;
  icon: LucideIcon;
  image?: string;
  comingSoon?: boolean;
  wide?: boolean;
};

export const storyLayers: StoryNode[][] = [
  [{ id: "createAccount", icon: LogIn, wide: true }],
  [
    { id: "ios", icon: Smartphone },
    { id: "android", icon: TabletSmartphone },
    { id: "web", icon: Globe },
  ],
  [{ id: "importSong", icon: FilePlus, image: "/screenshot2.png", wide: true }],
  [
    { id: "sheets", icon: FileMusic, image: "/screenshot1.png" },
    { id: "slides", icon: Presentation, comingSoon: true },
    { id: "clicks", icon: AudioLines, comingSoon: true },
    { id: "pdfs", icon: FileDown, comingSoon: true },
    { id: "planSets", icon: ListMusic, comingSoon: true },
    { id: "shareTeam", icon: Users, comingSoon: true },
    { id: "liveSessions", icon: Radio, comingSoon: true },
    { id: "digitalMd", icon: Sparkles, comingSoon: true },
  ],
];

type StoryDiagramState = {
  openId: string | null;
  prefersHover: boolean;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
};

function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const update = () => setPrefersHover(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersHover;
}

function layerListClass(count: number) {
  if (count === 1) {
    return "flex justify-center";
  }

  if (count === 3) {
    return "grid grid-cols-3 items-start justify-items-center gap-x-2 gap-y-4 sm:gap-x-3";
  }

  return "grid grid-cols-2 items-start justify-items-center gap-x-3 gap-y-6 md:grid-cols-4";
}

type Point = { x: number; y: number };

function firstRowNodes(layer: Element): HTMLElement[] {
  const nodes = [...layer.querySelectorAll<HTMLElement>("[data-story-node]")];
  if (nodes.length <= 1) {
    return nodes;
  }

  const top = nodes[0].getBoundingClientRect().top;
  return nodes.filter(
    (node) => Math.abs(node.getBoundingClientRect().top - top) < 12,
  );
}

function nodeAnchor(
  node: HTMLElement,
  rootBox: DOMRect,
  edge: "top" | "bottom",
): Point {
  const box = node.getBoundingClientRect();
  return {
    x: Math.round(box.left + box.width / 2 - rootBox.left),
    y: Math.round((edge === "top" ? box.top : box.bottom) - rootBox.top),
  };
}

function orthogonalPaths(
  sources: HTMLElement[],
  targets: HTMLElement[],
  rootBox: DOMRect,
): string[] {
  if (sources.length === 0 || targets.length === 0) {
    return [];
  }

  const from = sources.map((node) => nodeAnchor(node, rootBox, "bottom"));
  const to = targets.map((node) => nodeAnchor(node, rootBox, "top"));
  const midY = Math.round(
    (Math.max(...from.map((point) => point.y)) +
      Math.min(...to.map((point) => point.y))) /
      2,
  );
  const xValues = [...from.map((point) => point.x), ...to.map((point) => point.x)];
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);

  const paths = [
    ...from.map((point) => `M ${point.x} ${point.y} L ${point.x} ${midY}`),
    ...to.map((point) => `M ${point.x} ${midY} L ${point.x} ${point.y}`),
  ];

  if (xMin !== xMax) {
    paths.push(`M ${xMin} ${midY} L ${xMax} ${midY}`);
  }

  return paths;
}

function measureStoryPaths(root: HTMLElement): string[] {
  const layers = [...root.querySelectorAll("[data-story-layer]")];
  const rootBox = root.getBoundingClientRect();
  const paths: string[] = [];

  for (let index = 0; index < layers.length - 1; index += 1) {
    paths.push(
      ...orthogonalPaths(
        firstRowNodes(layers[index]),
        firstRowNodes(layers[index + 1]),
        rootBox,
      ),
    );
  }

  return paths;
}

function StoryNodeCard({
  node,
  openId,
  prefersHover,
  onToggle,
  onHover,
}: {
  node: StoryNode;
} & StoryDiagramState) {
  const { t } = useTranslation();
  const detailsId = useId();
  const Icon = node.icon;
  const open = openId === node.id;
  const label = t(`story.nodes.${node.id}.label`);

  return (
    <article
      className={cn(
        "rounded-xl border bg-[var(--color-surface)] p-4 text-center shadow-sm transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
        node.wide ? "w-56 sm:w-72" : "w-28 sm:w-40 md:w-44",
        open
          ? "border-[var(--color-primary)] shadow-[var(--shadow-elevated)]"
          : "border-[var(--color-border)]",
      )}
      onMouseEnter={() => {
        if (prefersHover) {
          onHover(node.id);
        }
      }}
      onMouseLeave={() => {
        if (prefersHover) {
          onHover(null);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={(event) => {
          onToggle(node.id);
          if (open) {
            event.currentTarget.blur();
          }
        }}
        className="flex w-full flex-col items-center gap-2 rounded-md text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-lg border transition-colors",
            open
              ? "border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              : "border-[var(--color-border)] bg-[var(--color-muted)]/50 text-[var(--color-foreground)]",
          )}
        >
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold leading-snug">{label}</span>
        {node.comingSoon ? <ComingSoonLabel /> : null}
        <ChevronDown
          className={cn(
            "size-4 text-[var(--color-muted-foreground)] transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={detailsId}
        role="region"
        aria-label={label}
        className={cn(
          "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          open && "grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-3 pt-3 text-left">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {t(`story.nodes.${node.id}.description`)}
            </p>
            {node.image ? (
              <Image
                src={node.image}
                alt={t(`story.nodes.${node.id}.alt`)}
                width={960}
                height={640}
                className="h-auto w-full rounded-lg border border-[var(--color-border)] object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 px-3 text-center text-xs text-[var(--color-muted-foreground)]">
                {t("story.screenshotSoon")}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function StoryLayer({
  nodes,
  ...cardState
}: {
  nodes: StoryNode[];
} & StoryDiagramState) {
  return (
    <ul className={layerListClass(nodes.length)} data-story-layer>
      {nodes.map((node) => (
        <li
          key={node.id}
          className="flex flex-col items-center px-1 sm:px-2"
          data-story-node
        >
          <StoryNodeCard node={node} {...cardState} />
        </li>
      ))}
    </ul>
  );
}

export function StoryDiagram() {
  const { t } = useTranslation();
  const prefersHover = usePrefersHover();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const diagramRef = useRef<HTMLDivElement>(null);
  const openId = (prefersHover ? hoveredId : null) ?? expandedId;

  const onToggle = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedId(null);
        setHoveredId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useLayoutEffect(() => {
    const root = diagramRef.current;
    if (!root) {
      return;
    }

    const update = () => {
      setPaths(measureStoryPaths(root));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    window.addEventListener("resize", update);
    root.addEventListener("transitionend", update);
    const timeoutId = window.setTimeout(update, 240);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      root.removeEventListener("transitionend", update);
      window.clearTimeout(timeoutId);
    };
  }, [openId]);

  const cardState: StoryDiagramState = {
    openId,
    prefersHover,
    onToggle,
    onHover: setHoveredId,
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:text-[0.8125rem]">
          {t("story.eyebrow")}
        </p>
        <h2 className="text-balance text-3xl font-semibold">
          {t("story.title")}
        </h2>
        <p className="text-base text-[var(--color-muted-foreground)]">
          {t("story.description")}
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-8 sm:px-6">
        <div ref={diagramRef} className="relative flex flex-col items-center gap-10">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-[var(--color-muted-foreground)]"
            aria-hidden
          >
            {paths.map((path) => (
              <path
                key={path}
                d={path}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                opacity="0.55"
              />
            ))}
          </svg>
          {storyLayers.map((nodes) => (
            <StoryLayer
              key={nodes.map((node) => node.id).join("-")}
              nodes={nodes}
              {...cardState}
            />
          ))}
        </div>
        <p className="mt-8 text-center text-xs uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
          {t("story.hint")}
        </p>
      </div>
    </section>
  );
}
