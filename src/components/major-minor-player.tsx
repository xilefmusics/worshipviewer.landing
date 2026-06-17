"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  CHORD_DURATION,
  CHORD_GAP,
  playChord,
} from "@/lib/chord-audio";
import { cn } from "@/lib/utils";

const COMPARISON_CHORDS = [
  { label: "Major", notes: ["C4", "E4", "G4"] },
  { label: "Minor", notes: ["C4", "Eb4", "G4"] },
] as const;

export function MajorMinorPlayer({ embedded = false }: { embedded?: boolean } = {}) {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);
  const highlightTimeoutsRef = useRef<number[]>([]);

  const clearHighlightTimeouts = useCallback(() => {
    for (const timeoutId of highlightTimeoutsRef.current) {
      globalThis.window.clearTimeout(timeoutId);
    }
    highlightTimeoutsRef.current = [];
  }, []);

  const stopPlayback = useCallback(() => {
    if (stopTimeoutRef.current !== null) {
      globalThis.window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    clearHighlightTimeouts();
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
    setActiveIndex(null);
  }, [clearHighlightTimeouts]);

  const playComparison = async () => {
    if (isPlaying) {
      return;
    }

    stopPlayback();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();
    setIsPlaying(true);

    const startTime = audioContext.currentTime;

    for (const [index, chord] of COMPARISON_CHORDS.entries()) {
      const chordStart = startTime + index * (CHORD_DURATION + CHORD_GAP);
      playChord(audioContext, [...chord.notes], chordStart, CHORD_DURATION);

      highlightTimeoutsRef.current.push(
        globalThis.window.setTimeout(() => {
          setActiveIndex(index);
        }, (chordStart - startTime) * 1000),
      );
    }

    const totalDuration =
      COMPARISON_CHORDS.length * (CHORD_DURATION + CHORD_GAP) -
      CHORD_GAP +
      0.05;

    stopTimeoutRef.current = globalThis.window.setTimeout(() => {
      stopPlayback();
    }, totalDuration * 1000);
  };

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const content = (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={isPlaying ? stopPlayback : playComparison}
        aria-label={
          isPlaying
            ? t("tutorials.majorMinorPlayer.stop")
            : t("tutorials.majorMinorPlayer.play")
        }
      >
        {isPlaying ? <Square /> : <Play />}
        {isPlaying
          ? t("tutorials.majorMinorPlayer.stop")
          : t("tutorials.majorMinorPlayer.play")}
      </Button>

      <div className="flex flex-wrap gap-1.5" aria-live="polite">
        {COMPARISON_CHORDS.map((chord, index) => (
          <span
            key={chord.label}
            className={cn(
              "rounded-md border px-2.5 py-1 text-sm font-medium transition-colors",
              activeIndex === index
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]",
            )}
          >
            {chord.label}
          </span>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      {content}
    </div>
  );
}
