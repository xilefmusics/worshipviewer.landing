"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  CIRCLE_OF_FIFTHS_NOTES,
  circleOfFifthsPosition,
} from "@/lib/circle-of-fifths-notes";
import { cn } from "@/lib/utils";

const CHROMATIC_SEMITONES = 12;
const BUTTON_COUNT = 13;
const OCTAVE_SEMITONE = 12;
const BASE_FREQUENCY = 261.63;
const NOTE_DURATION = 0.45;
const NOTE_GAP = 0.08;

const NOTE_BUTTONS = [
  { label: "C", semitone: 0, ariaNote: "C" },
  { label: "D♭", semitone: 1, ariaNote: "D flat" },
  { label: "D", semitone: 2, ariaNote: "D" },
  { label: "E♭", semitone: 3, ariaNote: "E flat" },
  { label: "E", semitone: 4, ariaNote: "E" },
  { label: "F", semitone: 5, ariaNote: "F" },
  { label: "G♭", semitone: 6, ariaNote: "G flat" },
  { label: "G", semitone: 7, ariaNote: "G" },
  { label: "A♭", semitone: 8, ariaNote: "A flat" },
  { label: "A", semitone: 9, ariaNote: "A" },
  { label: "B♭", semitone: 10, ariaNote: "B flat" },
  { label: "B", semitone: 11, ariaNote: "B" },
  { label: "C", semitone: OCTAVE_SEMITONE, ariaNote: "C (octave)" },
] as const;

const MODE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
} as const;

type ModePresetKey = keyof typeof MODE_INTERVALS;

const MODE_WHITE_KEY_ROOTS: Partial<
  Record<
    | "major"
    | "dorian"
    | "phrygian"
    | "lydian"
    | "mixolydian"
    | "naturalMinor"
    | "locrian",
    string
  >
> = {
  major: "C",
  dorian: "D",
  phrygian: "E",
  lydian: "F",
  mixolydian: "G",
  naturalMinor: "A",
  locrian: "B",
};

function buildScaleFromIntervals(intervals: readonly number[]): number[] {
  return [...intervals, OCTAVE_SEMITONE];
}

const SCALE_PRESETS = {
  major: buildScaleFromIntervals(MODE_INTERVALS.major),
  dorian: buildScaleFromIntervals(MODE_INTERVALS.dorian),
  phrygian: buildScaleFromIntervals(MODE_INTERVALS.phrygian),
  lydian: buildScaleFromIntervals(MODE_INTERVALS.lydian),
  mixolydian: buildScaleFromIntervals(MODE_INTERVALS.mixolydian),
  naturalMinor: buildScaleFromIntervals(MODE_INTERVALS.naturalMinor),
  locrian: buildScaleFromIntervals(MODE_INTERVALS.locrian),
  harmonicMinor: buildScaleFromIntervals(MODE_INTERVALS.harmonicMinor),
  melodicMinor: buildScaleFromIntervals(MODE_INTERVALS.melodicMinor),
  pentatonicMajor: [0, 2, 4, 7, 9, OCTAVE_SEMITONE],
  pentatonicMinor: [0, 3, 5, 7, 10, OCTAVE_SEMITONE],
  blues: [0, 3, 5, 6, 7, 10, OCTAVE_SEMITONE],
  majorBlues: [0, 2, 3, 4, 7, 9, OCTAVE_SEMITONE],
  prometheus: [0, 2, 4, 6, 9, 10, OCTAVE_SEMITONE],
  augmentedHexatonic: [0, 3, 4, 7, 8, 11, OCTAVE_SEMITONE],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, OCTAVE_SEMITONE],
  hijaz: [0, 1, 4, 5, 7, 8, 11, OCTAVE_SEMITONE],
  bayati: [0, 1, 4, 5, 7, 8, 10, OCTAVE_SEMITONE],
  rast: [0, 2, 4, 5, 7, 9, 10, OCTAVE_SEMITONE],
  saba: [0, 1, 4, 5, 6, 8, 10, OCTAVE_SEMITONE],
  sikah: [0, 3, 4, 5, 7, 8, 10, OCTAVE_SEMITONE],
  kurd: [0, 2, 3, 5, 7, 8, 10, OCTAVE_SEMITONE],
  doubleHarmonic: [0, 1, 4, 5, 7, 8, 11, OCTAVE_SEMITONE],
  inSen: [0, 1, 5, 7, 10, OCTAVE_SEMITONE],
  hirajoshi: [0, 2, 3, 7, 8, OCTAVE_SEMITONE],
  iwato: [0, 1, 5, 6, 10, OCTAVE_SEMITONE],
  minyo: [0, 2, 5, 7, 10, OCTAVE_SEMITONE],
  bhairav: [0, 1, 4, 5, 7, 8, 11, OCTAVE_SEMITONE],
  bhairavi: [0, 1, 3, 5, 7, 8, 10, OCTAVE_SEMITONE],
  hungarianMinor: [0, 2, 3, 6, 7, 8, 11, OCTAVE_SEMITONE],
  hungarianMajor: [0, 3, 4, 6, 7, 9, 10, OCTAVE_SEMITONE],
  romanianMinor: [0, 2, 3, 6, 7, 9, 10, OCTAVE_SEMITONE],
  persian: [0, 1, 4, 5, 6, 8, 11, OCTAVE_SEMITONE],
  neapolitanMinor: [0, 1, 3, 5, 7, 8, 11, OCTAVE_SEMITONE],
  wholeTone: [0, 2, 4, 6, 8, 10, OCTAVE_SEMITONE],
} as const;

type ScalePresetKey = keyof typeof SCALE_PRESETS;

const SCALE_PRESET_GROUPS: ReadonlyArray<{
  groupKey: string;
  presets: readonly ScalePresetKey[];
}> = [
  {
    groupKey: "twelveTone",
    presets: ["chromatic"],
  },
  {
    groupKey: "sevenTone",
    presets: [
      "major",
      "dorian",
      "phrygian",
      "lydian",
      "mixolydian",
      "naturalMinor",
      "locrian",
      "harmonicMinor",
      "melodicMinor",
    ],
  },
  {
    groupKey: "sixTone",
    presets: [
      "blues",
      "majorBlues",
      "wholeTone",
      "prometheus",
      "augmentedHexatonic",
    ],
  },
  {
    groupKey: "fiveTone",
    presets: ["pentatonicMajor", "pentatonicMinor"],
  },
  {
    groupKey: "arabicMiddleEastern",
    presets: [
      "rast",
      "bayati",
      "hijaz",
      "kurd",
      "sikah",
      "saba",
      "doubleHarmonic",
      "persian",
    ],
  },
  {
    groupKey: "indian",
    presets: ["bhairav", "bhairavi"],
  },
  {
    groupKey: "asian",
    presets: ["inSen", "minyo", "hirajoshi", "iwato"],
  },
  {
    groupKey: "otherWorld",
    presets: [
      "hungarianMinor",
      "hungarianMajor",
      "romanianMinor",
      "neapolitanMinor",
    ],
  },
];

const ALL_SCALE_PRESET_KEYS = SCALE_PRESET_GROUPS.flatMap(
  ({ presets }) => presets,
);

function getPresetLabel(
  key: ScalePresetKey,
  translate: (translationKey: string, options?: { root?: string }) => string,
): string {
  const whiteKeyRoot =
    key in MODE_WHITE_KEY_ROOTS
      ? MODE_WHITE_KEY_ROOTS[key as keyof typeof MODE_WHITE_KEY_ROOTS]
      : undefined;

  if (whiteKeyRoot) {
    return translate(`tutorials.scaleSimulator.presets.${key}`, {
      root: whiteKeyRoot,
    });
  }

  return translate(`tutorials.scaleSimulator.presets.${key}`);
}

function semitonesToSelection(semitones: number[]): boolean[] {
  const selection = Array.from({ length: BUTTON_COUNT }, () => false);
  for (const semitone of semitones) {
    if (semitone >= 0 && semitone <= OCTAVE_SEMITONE) {
      selection[semitone] = true;
    }
  }
  return selection;
}

function selectionToSemitones(selection: boolean[]): number[] {
  return selection.flatMap((enabled, index) => (enabled ? [index] : []));
}

function selectionMatchesPreset(
  selection: boolean[],
  preset: number[],
): boolean {
  const selected = selectionToSemitones(selection);
  return (
    selected.length === preset.length &&
    selected.every((value, index) => value === preset[index])
  );
}

function detectPreset(selection: boolean[]): ScalePresetKey | "custom" {
  for (const key of ALL_SCALE_PRESET_KEYS) {
    if (selectionMatchesPreset(selection, [...SCALE_PRESETS[key]])) {
      return key;
    }
  }
  return "custom";
}

export function ScaleSimulator({
  readOnly = false,
  preset = "major",
}: {
  readOnly?: boolean;
  preset?: ScalePresetKey;
} = {}) {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<boolean[]>(() =>
    semitonesToSelection([...SCALE_PRESETS[preset]]),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);

  const activePreset = detectPreset(selection);

  const toggleSemitone = (index: number) => {
    setSelection((current) => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  };

  const applyPreset = (presetKey: ScalePresetKey) => {
    setSelection(semitonesToSelection([...SCALE_PRESETS[presetKey]]));
  };

  const stopPlayback = useCallback(() => {
    if (stopTimeoutRef.current !== null) {
      globalThis.window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
  }, []);

  const playScale = async () => {
    const semitones = selectionToSemitones(selection);
    if (semitones.length === 0 || isPlaying) {
      return;
    }

    stopPlayback();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();
    setIsPlaying(true);

    const startTime = audioContext.currentTime;

    for (const [index, semitone] of semitones.entries()) {
      const noteStart = startTime + index * (NOTE_DURATION + NOTE_GAP);
      const noteEnd = noteStart + NOTE_DURATION;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "triangle";
      oscillator.frequency.value =
        BASE_FREQUENCY * 2 ** (semitone / CHROMATIC_SEMITONES);

      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.22, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);

      oscillator.start(noteStart);
      oscillator.stop(noteEnd);
    }

    const totalDuration =
      semitones.length * (NOTE_DURATION + NOTE_GAP) - NOTE_GAP + 0.05;

    stopTimeoutRef.current = globalThis.window.setTimeout(() => {
      stopPlayback();
    }, totalDuration * 1000);
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      <div className="flex flex-wrap gap-1.5">
        {NOTE_BUTTONS.map(({ label, semitone, ariaNote }) => {
          const enabled = selection[semitone];
          const className = cn(
            "min-w-[2.25rem] flex-1 rounded-md border px-1 py-2 text-center text-xs font-medium sm:text-sm",
            enabled
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]",
            !readOnly &&
              !enabled &&
              "transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
          );

          if (readOnly) {
            return (
              <div
                key={semitone}
                aria-hidden={!enabled}
                className={className}
              >
                {label}
              </div>
            );
          }

          return (
            <button
              key={semitone}
              type="button"
              aria-pressed={enabled}
              aria-label={t("tutorials.scaleSimulator.toggleNote", {
                note: ariaNote,
              })}
              onClick={() => toggleSemitone(semitone)}
              className={className}
            >
              {label}
            </button>
          );
        })}
      </div>

      {readOnly ? null : (
        <div
          className="relative mx-auto mt-4 aspect-square w-full max-w-[280px] rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]"
          role="group"
          aria-label={t("tutorials.scaleSimulator.circleOfFifths")}
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-medium text-[var(--color-muted-foreground)]">
            {t("tutorials.scaleSimulator.circleCenterLabel")}
          </span>
          {CIRCLE_OF_FIFTHS_NOTES.map((note, index) => {
            const { x, y } = circleOfFifthsPosition(index);
            const enabled = selection[note.semitones];

            return (
              <button
                key={`circle-${note.semitones}`}
                type="button"
                aria-pressed={enabled}
                aria-label={t("tutorials.scaleSimulator.toggleNote", {
                  note: note.label,
                })}
                onClick={() => toggleSemitone(note.semitones)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={cn(
                  "absolute size-11 -translate-x-1/2 -translate-y-1/2 rounded-full border text-sm font-medium transition-colors",
                  enabled
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                    : "border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80",
                )}
              >
                {note.label}
              </button>
            );
          })}
        </div>
      )}

      {readOnly ? null : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              if (isPlaying) {
                stopPlayback();
                return;
              }
              void playScale();
            }}
            disabled={selectionToSemitones(selection).length === 0}
            aria-label={
              isPlaying
                ? t("tutorials.scaleSimulator.stop")
                : t("tutorials.scaleSimulator.play")
            }
          >
            {isPlaying ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
            {isPlaying
              ? t("tutorials.scaleSimulator.stop")
              : t("tutorials.scaleSimulator.play")}
          </Button>

          <label className="flex min-w-[12rem] flex-1 items-center gap-2 text-sm">
            <span className="shrink-0 text-[var(--color-muted-foreground)]">
              {t("tutorials.scaleSimulator.preset")}
            </span>
            <select
              value={activePreset}
              onChange={(event) => {
                const value = event.target.value;
                if (value !== "custom" && value in SCALE_PRESETS) {
                  applyPreset(value as ScalePresetKey);
                }
              }}
              className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
            >
              {SCALE_PRESET_GROUPS.map(({ groupKey, presets }) => (
                <optgroup
                  key={groupKey}
                  label={t(`tutorials.scaleSimulator.presetGroups.${groupKey}`)}
                >
                  {presets.map((key) => (
                    <option key={key} value={key}>
                      {getPresetLabel(key, t)}
                    </option>
                  ))}
                </optgroup>
              ))}
              {activePreset === "custom" ? (
                <option value="custom">
                  {t("tutorials.scaleSimulator.presets.custom")}
                </option>
              ) : null}
            </select>
          </label>
        </div>
      )}
    </div>
  );
}
