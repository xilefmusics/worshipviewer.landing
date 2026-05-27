"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  WAVE_HEIGHT,
  WAVE_WIDTH,
  buildDualWavePaths,
} from "@/lib/wave-math";

const BASE_FREQUENCY = 220;
const AMPLITUDE = 0.5;
const MASTER_GAIN = 0.25;

type IntervalName =
  | "minorSecond"
  | "majorSecond"
  | "minorThird"
  | "majorThird"
  | "fourth"
  | "tritone"
  | "fifth"
  | "minorSixth"
  | "majorSixth"
  | "minorSeventh"
  | "majorSeventh"
  | "octave";

type Tuning = "tempered" | "pure";

type IntervalRow = {
  key: IntervalName;
  semitones: number;
  pureRatio: number;
  pureRatioLabel: string;
};

type IntervalSelection = {
  interval: IntervalName;
  tuning: Tuning;
};

const INTERVAL_ROWS: IntervalRow[] = [
  {
    key: "minorSecond",
    semitones: 1,
    pureRatio: 16 / 15,
    pureRatioLabel: "16:15",
  },
  {
    key: "majorSecond",
    semitones: 2,
    pureRatio: 9 / 8,
    pureRatioLabel: "9:8",
  },
  {
    key: "minorThird",
    semitones: 3,
    pureRatio: 6 / 5,
    pureRatioLabel: "6:5",
  },
  {
    key: "majorThird",
    semitones: 4,
    pureRatio: 5 / 4,
    pureRatioLabel: "5:4",
  },
  {
    key: "fourth",
    semitones: 5,
    pureRatio: 4 / 3,
    pureRatioLabel: "4:3",
  },
  {
    key: "tritone",
    semitones: 6,
    pureRatio: 45 / 32,
    pureRatioLabel: "45:32",
  },
  {
    key: "fifth",
    semitones: 7,
    pureRatio: 3 / 2,
    pureRatioLabel: "3:2",
  },
  {
    key: "minorSixth",
    semitones: 8,
    pureRatio: 8 / 5,
    pureRatioLabel: "8:5",
  },
  {
    key: "majorSixth",
    semitones: 9,
    pureRatio: 5 / 3,
    pureRatioLabel: "5:3",
  },
  {
    key: "minorSeventh",
    semitones: 10,
    pureRatio: 16 / 9,
    pureRatioLabel: "16:9",
  },
  {
    key: "majorSeventh",
    semitones: 11,
    pureRatio: 15 / 8,
    pureRatioLabel: "15:8",
  },
  {
    key: "octave",
    semitones: 12,
    pureRatio: 2,
    pureRatioLabel: "2:1",
  },
];

function temperedRatio(semitones: number): number {
  return 2 ** (semitones / 12);
}

function getIntervalRatio(row: IntervalRow, tuning: Tuning): number {
  return tuning === "pure" ? row.pureRatio : temperedRatio(row.semitones);
}

function getRatioDescription(
  row: IntervalRow,
  tuning: Tuning,
  translate: (key: string, options?: Record<string, string | number>) => string,
): string {
  if (tuning === "pure") {
    return row.pureRatioLabel;
  }

  return translate("tutorials.intervalSimulator.temperedRatio", {
    semitones: row.semitones,
  });
}

export function IntervalSimulator() {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<IntervalSelection>({
    interval: "fifth",
    tuning: "pure",
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const animationRef = useRef<number | null>(null);

  const selectedRow = INTERVAL_ROWS.find((row) => row.key === selection.interval)!;
  const ratio = getIntervalRatio(selectedRow, selection.tuning);
  const intervalFrequency = BASE_FREQUENCY * ratio;

  const stopPlayback = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    for (const oscillator of oscillatorsRef.current) {
      oscillator.stop();
      oscillator.disconnect();
    }
    oscillatorsRef.current = [];
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
  }, []);

  const startPlayback = async () => {
    stopPlayback();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();

    for (const frequency of [BASE_FREQUENCY, intervalFrequency]) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.value = MASTER_GAIN;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillatorsRef.current.push(oscillator);
    }

    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || oscillatorsRef.current.length < 2) {
      return;
    }
    oscillatorsRef.current[0].frequency.value = BASE_FREQUENCY;
    oscillatorsRef.current[1].frequency.value = intervalFrequency;
  }, [intervalFrequency, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setPhase((current) => current + delta * BASE_FREQUENCY * 0.05);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const { base, interval } = buildDualWavePaths(
    BASE_FREQUENCY,
    intervalFrequency,
    AMPLITUDE,
    isPlaying ? phase : 0,
  );

  const renderTuningButton = (row: IntervalRow, tuning: Tuning) => {
    const isSelected =
      selection.interval === row.key && selection.tuning === tuning;

    return (
      <button
        key={`${row.key}-${tuning}`}
        type="button"
        aria-pressed={isSelected}
        aria-label={t("tutorials.intervalSimulator.selectInterval", {
          interval: t(`tutorials.intervalSimulator.intervals.${row.key}`),
          tuning: t(`tutorials.intervalSimulator.tunings.${tuning}`),
        })}
        onClick={() => setSelection({ interval: row.key, tuning })}
        className={cn(
          "min-w-0 rounded-md border px-2 py-2 text-center text-xs font-medium transition-colors sm:text-sm",
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
            : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
        )}
      >
        {t(`tutorials.intervalSimulator.tunings.${tuning}`)}
      </button>
    );
  };

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      <svg
        viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
        className="h-24 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1={WAVE_HEIGHT / 2}
          x2={WAVE_WIDTH}
          y2={WAVE_HEIGHT / 2}
          className="stroke-[var(--color-border)]"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <path
          d={interval}
          fill="none"
          className="stroke-[var(--color-muted-foreground)]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.75}
        />
        <path
          d={base}
          fill="none"
          className="stroke-[var(--color-primary)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="mt-4 space-y-1.5"
        role="group"
        aria-label={t("tutorials.intervalSimulator.intervalGrid")}
      >
        <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 px-0.5">
          <span aria-hidden="true" />
          <span className="text-center text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted-foreground)] sm:text-xs">
            {t("tutorials.intervalSimulator.tunings.tempered")}
          </span>
          <span className="text-center text-[10px] font-medium uppercase tracking-wide text-[var(--color-muted-foreground)] sm:text-xs">
            {t("tutorials.intervalSimulator.tunings.pure")}
          </span>
        </div>

        {INTERVAL_ROWS.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-1.5"
          >
            <span className="text-xs font-medium text-[var(--color-foreground)] sm:text-sm">
              {t(`tutorials.intervalSimulator.intervals.${row.key}`)}
            </span>
            {renderTuningButton(row, "tempered")}
            {renderTuningButton(row, "pure")}
          </div>
        ))}
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
        {t("tutorials.intervalSimulator.ratioLabel", {
          base: Math.round(BASE_FREQUENCY),
          interval: Math.round(intervalFrequency),
          ratio: getRatioDescription(selectedRow, selection.tuning, t),
          tuning: t(`tutorials.intervalSimulator.tunings.${selection.tuning}`),
          intervalName: t(
            `tutorials.intervalSimulator.intervals.${selection.interval}`,
          ),
        })}
      </p>

      <div className="mt-4">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            if (isPlaying) {
              stopPlayback();
              return;
            }
            void startPlayback();
          }}
          aria-label={
            isPlaying
              ? t("tutorials.intervalSimulator.stop")
              : t("tutorials.intervalSimulator.play")
          }
        >
          {isPlaying ? (
            <Square className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
          {isPlaying
            ? t("tutorials.intervalSimulator.stop")
            : t("tutorials.intervalSimulator.play")}
        </Button>
      </div>
    </div>
  );
}
