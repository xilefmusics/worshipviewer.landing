"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { ChordStaffItem } from "@/components/chord-staff";
import { chordStaffNotesToPitches } from "@/components/chord-staff";
import { Button } from "@/components/ui/button";
import {
  CHORD_DURATION,
  CHORD_GAP,
  playChord,
} from "@/lib/chord-audio";
import { cn } from "@/lib/utils";

type ChordPlayerProps = {
  chords: ChordStaffItem[];
  embedded?: boolean;
};

export function ChordPlayer({ chords, embedded = false }: ChordPlayerProps) {
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

  const playChords = async () => {
    if (chords.length === 0 || isPlaying) {
      return;
    }

    stopPlayback();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();
    setIsPlaying(true);

    const startTime = audioContext.currentTime;

    for (const [index, chord] of chords.entries()) {
      const chordStart = startTime + index * (CHORD_DURATION + CHORD_GAP);
      playChord(audioContext, chordStaffNotesToPitches(chord.notes), chordStart, CHORD_DURATION);

      const highlightDelay = chordStart - startTime;
      highlightTimeoutsRef.current.push(
        globalThis.window.setTimeout(() => {
          setActiveIndex(index);
        }, highlightDelay * 1000),
      );
    }

    const totalDuration =
      chords.length * (CHORD_DURATION + CHORD_GAP) - CHORD_GAP + 0.05;

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
        onClick={isPlaying ? stopPlayback : playChords}
        aria-label={
          isPlaying
            ? t("tutorials.chordPlayer.stop")
            : t("tutorials.chordPlayer.play")
        }
      >
        {isPlaying ? <Square /> : <Play />}
        {isPlaying
          ? t("tutorials.chordPlayer.stop")
          : t("tutorials.chordPlayer.play")}
      </Button>

      <div className="flex flex-wrap gap-1.5" aria-live="polite">
        {chords.map((chord, index) => (
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
