"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  CIRCLE_OF_FIFTHS_NOTES,
  circleOfFifthsPosition,
} from "@/lib/circle-of-fifths-notes";
import { cn } from "@/lib/utils";

const BASE_FREQUENCY = 261.63;
const NOTE_DURATION = 0.55;
const NOTE_GAP = 0.12;
const MASTER_GAIN = 0.28;

function semitonesToFrequency(semitones: number): number {
  return BASE_FREQUENCY * 2 ** (semitones / 12);
}

export function CircleOfFifthsSimulator() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  const stopPlayback = useCallback(() => {
    if (stopTimeoutRef.current !== null) {
      globalThis.window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
    setIsWalking(false);
  }, []);

  const playNoteAtIndex = useCallback(
    async (index: number, duration = NOTE_DURATION) => {
      void audioContextRef.current?.close();

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.resume();

      const note = CIRCLE_OF_FIFTHS_NOTES[index];
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const startTime = audioContext.currentTime;
      const endTime = startTime + duration;

      oscillator.type = "triangle";
      oscillator.frequency.value = semitonesToFrequency(note.semitones);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(MASTER_GAIN, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, endTime);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(endTime);

      stopTimeoutRef.current = globalThis.window.setTimeout(() => {
        void audioContext.close();
        if (audioContextRef.current === audioContext) {
          audioContextRef.current = null;
        }
        setIsPlaying(false);
      }, duration * 1000 + 50);
    },
    [],
  );

  const selectAndPlayNote = (index: number) => {
    if (isWalking) {
      return;
    }
    setActiveIndex(index);
    stopPlayback();
    setIsPlaying(true);
    void playNoteAtIndex(index);
  };

  const playActiveNote = async () => {
    stopPlayback();
    setIsPlaying(true);
    await playNoteAtIndex(activeIndex);
  };

  const walkFifths = async () => {
    stopPlayback();
    setIsWalking(true);
    setIsPlaying(true);

    for (let step = 0; step < CIRCLE_OF_FIFTHS_NOTES.length; step += 1) {
      setActiveIndex(step);
      await playNoteAtIndex(step);
      await new Promise((resolve) => {
        stopTimeoutRef.current = globalThis.window.setTimeout(
          resolve,
          (NOTE_DURATION + NOTE_GAP) * 1000,
        );
      });
    }

    setActiveIndex(0);
    setIsWalking(false);
    setIsPlaying(false);
    audioContextRef.current = null;
  };

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      <div
        className="relative mx-auto aspect-square w-full max-w-[280px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
        role="group"
        aria-label={t("tutorials.circleOfFifthsSimulator.ariaLabel")}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-[var(--color-muted-foreground)]">
          {t("tutorials.circleOfFifthsSimulator.centerLabel")}
        </span>
        {CIRCLE_OF_FIFTHS_NOTES.map((note, index) => {
          const { x, y } = circleOfFifthsPosition(index);
          const isActive = activeIndex === index;

          return (
            <button
              key={note.label}
              type="button"
              aria-pressed={isActive}
              aria-label={t("tutorials.circleOfFifthsSimulator.selectNote", {
                note: note.label,
              })}
              disabled={isWalking}
              onClick={() => selectAndPlayNote(index)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={cn(
                "absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border text-sm font-medium transition-colors",
                isActive
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80",
              )}
            >
              {note.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={isWalking}
          onClick={() => {
            if (isPlaying && !isWalking) {
              stopPlayback();
              return;
            }
            if (!isWalking) {
              void playActiveNote();
            }
          }}
          aria-label={
            isPlaying && !isWalking
              ? t("tutorials.circleOfFifthsSimulator.stop")
              : t("tutorials.circleOfFifthsSimulator.play")
          }
        >
          {isPlaying && !isWalking ? (
            <Square className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
          {isPlaying && !isWalking
            ? t("tutorials.circleOfFifthsSimulator.stop")
            : t("tutorials.circleOfFifthsSimulator.play")}
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isWalking}
          onClick={() => {
            if (isWalking) {
              stopPlayback();
              return;
            }
            void walkFifths();
          }}
        >
          {isWalking
            ? t("tutorials.circleOfFifthsSimulator.stopWalk")
            : t("tutorials.circleOfFifthsSimulator.walkFifths")}
        </Button>
      </div>
    </div>
  );
}
