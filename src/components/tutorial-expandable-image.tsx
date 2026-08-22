"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import type { TutorialImage } from "@/lib/tutorial-content";
import { cn } from "@/lib/utils";

const FRETBOARD_VIEW_X = 95;
const FRETBOARD_VIEW_WIDTH = 1344;
const FRETBOARD_NUT_X = 130;
const FRET_SPACING = 90;
const FRET_CROP_PADDING = 24;

function fretboardCropScale(maxFret: number) {
  const endX = FRETBOARD_NUT_X + maxFret * FRET_SPACING + FRET_CROP_PADDING;
  return FRETBOARD_VIEW_WIDTH / (endX - FRETBOARD_VIEW_X);
}

function FretboardCrop({
  maxFret,
  className,
  children,
}: {
  maxFret: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("overflow-hidden", className)}>
      <div style={{ width: `${fretboardCropScale(maxFret) * 100}%` }}>
        {children}
      </div>
    </div>
  );
}

function TutorialImageLightbox({
  src,
  alt,
  maxFret,
  onClose,
}: {
  src: string;
  alt: string;
  maxFret?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close larger image"
        className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <X className="size-5" aria-hidden />
      </button>
      <div onClick={(event) => event.stopPropagation()}>
        {maxFret != null ? (
          <FretboardCrop
            maxFret={maxFret}
            className="max-h-[90vh] w-full max-w-[min(96vw,90rem)] rounded-lg bg-white"
          >
            <Image
              src={src}
              alt={alt}
              width={1600}
              height={292}
              className="h-auto w-full"
              priority
            />
          </FretboardCrop>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={1600}
            className="max-h-[90vh] w-auto max-w-[min(96vw,90rem)] rounded-lg bg-white object-contain"
            priority
          />
        )}
      </div>
    </div>,
    document.body,
  );
}

export function TutorialExpandableTrigger({
  src,
  alt,
  maxFret,
  className,
  children,
}: {
  src: string;
  alt: string;
  maxFret?: number;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className={cn(
          "block w-full cursor-zoom-in rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]",
          className,
        )}
      >
        {children}
      </button>
      {open ? (
        <TutorialImageLightbox
          src={src}
          alt={alt}
          maxFret={maxFret}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function TutorialExpandableImage({ entry }: { entry: TutorialImage }) {
  const image = (
    <Image
      src={entry.src}
      alt={entry.alt}
      width={entry.width === "half" ? 632 : 1344}
      height={entry.width === "half" ? 900 : 245}
      className={cn(
        "h-auto",
        entry.maxFret == null && "rounded-lg border border-[var(--color-border)]",
        entry.width === "half" ? "w-1/2 min-w-[12rem]" : "w-full",
      )}
    />
  );

  return (
    <figure className="space-y-2">
      <TutorialExpandableTrigger
        src={entry.src}
        alt={entry.alt}
        maxFret={entry.maxFret}
      >
        {entry.maxFret != null ? (
          <FretboardCrop
            maxFret={entry.maxFret}
            className="rounded-lg border border-[var(--color-border)]"
          >
            {image}
          </FretboardCrop>
        ) : (
          image
        )}
      </TutorialExpandableTrigger>
    </figure>
  );
}
