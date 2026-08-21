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
  Maximize2,
  Presentation,
  Radio,
  Smartphone,
  Sparkles,
  TabletSmartphone,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { ComingSoonLabel } from "@/components/coming-soon-label";
import { usePrefersHover } from "@/lib/use-prefers-hover";
import { cn } from "@/lib/utils";

/**
 * Extend this flow by adding a node to a layer. Labels, descriptions, and
 * image alts live under `story.nodes.{id}` in the i18n files.
 */
export type StoryNode = {
  id: string;
  icon: LucideIcon;
  image?: string;
  hideScreenshot?: boolean;
  comingSoon?: boolean;
  wide?: boolean;
};

export const storyLayers: StoryNode[][] = [
  [{ id: "createAccount", icon: LogIn, wide: true, image: "/wv_login.png" }],
  [
    { id: "ios", icon: Smartphone, hideScreenshot: true },
    { id: "android", icon: TabletSmartphone, hideScreenshot: true },
    { id: "web", icon: Globe, hideScreenshot: true },
  ],
  [{ id: "importSong", icon: FilePlus, image: "/wv_edit2.png", wide: true }],
  [
    { id: "sheets", icon: FileMusic, image: "/wv_sheet.png" },
    { id: "slides", icon: Presentation, image: "/wv_slide.png" },
    { id: "clicks", icon: AudioLines, comingSoon: true },
    { id: "pdfs", icon: FileDown, image: "/wv_pdf.png" },
    { id: "planSets", icon: ListMusic, image: "/wv_edit.png" },
    { id: "shareTeam", icon: Users, image: "/wv_team.png" },
    { id: "liveSessions", icon: Radio, image: "/wv_session.png" },
    { id: "digitalMd", icon: Sparkles, comingSoon: true },
  ],
];

type LightboxImage = {
  src: string;
  alt: string;
};

type StoryDiagramState = {
  openId: string | null;
  prefersHover: boolean;
  onToggle: (id: string, wasOpen: boolean) => void;
  onHover: (id: string | null) => void;
  onOpenLightbox: (image: LightboxImage) => void;
};

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
  onOpenLightbox,
}: {
  node: StoryNode;
} & StoryDiagramState) {
  const { t } = useTranslation();
  const detailsId = useId();
  const Icon = node.icon;
  const open = openId === node.id;
  const label = t(`story.nodes.${node.id}.label`);
  const imageAlt = t(`story.nodes.${node.id}.alt`);

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
          onToggle(node.id, open);
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
            {node.hideScreenshot ? null : node.image ? (
              <button
                type="button"
                onClick={() => {
                  onOpenLightbox({ src: node.image!, alt: imageAlt });
                }}
                aria-label={t("story.expandScreenshot")}
                className="group relative block w-full cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
              >
                <Image
                  src={node.image}
                  alt={imageAlt}
                  width={960}
                  height={640}
                  className="h-auto w-full rounded-lg border border-[var(--color-border)] object-contain transition-[opacity,border-color] group-hover:border-[var(--color-primary)] group-hover:opacity-90"
                />
                <span className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/90 text-[var(--color-foreground)] shadow-sm transition-colors group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)]">
                  <Maximize2 className="size-4" aria-hidden />
                </span>
              </button>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 px-3 text-center text-xs text-[var(--color-muted-foreground)]">
                {t("story.screenshotSoon")}
              </div>
            )}
            <Link
              href={`/tutorials/getting-started#${node.id}`}
              className="inline-block text-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              {t("story.tutorialLink")}
            </Link>
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

function ScreenshotLightbox({
  image,
  onClose,
}: {
  image: LightboxImage;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const closeLabel = t("story.closeScreenshot");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <X className="size-5" aria-hidden />
      </button>
      <Image
        src={image.src}
        alt={image.alt}
        width={2064}
        height={2752}
        className="max-h-[90vh] w-auto max-w-[min(90vw,56rem)] rounded-lg object-contain"
        onClick={(event) => event.stopPropagation()}
        priority
      />
    </div>,
    document.body,
  );
}

export function StoryDiagram() {
  const { t } = useTranslation();
  const prefersHover = usePrefersHover();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const diagramRef = useRef<HTMLDivElement>(null);
  const openId = (prefersHover ? hoveredId : null) ?? expandedId;

  const onToggle = useCallback((id: string, wasOpen: boolean) => {
    setHoveredId(null);
    setExpandedId(wasOpen ? null : id);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (lightbox) {
        setLightbox(null);
        return;
      }

      setExpandedId(null);
      setHoveredId(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightbox]);

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
    onOpenLightbox: setLightbox,
  };

  return (
    <section id="how-it-works" className="scroll-mt-8 space-y-6">
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
      {lightbox ? (
        <ScreenshotLightbox image={lightbox} onClose={() => setLightbox(null)} />
      ) : null}
    </section>
  );
}
