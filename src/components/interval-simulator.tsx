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

const INTERVAL_PRESETS = {
  octave: 2,
  fifth: 3 / 2,
  minorSecond: 16 / 15,
} as const;

type IntervalPreset = keyof typeof INTERVAL_PRESETS;

export function IntervalSimulator() {
  const { t } = useTranslation();
  const [preset, setPreset] = useState<IntervalPreset>("octave");
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const animationRef = useRef<number | null>(null);

  const ratio = INTERVAL_PRESETS[preset];
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

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(Object.keys(INTERVAL_PRESETS) as IntervalPreset[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={preset === key}
            onClick={() => setPreset(key)}
            className={cn(
              "min-w-[5rem] flex-1 rounded-md border px-2 py-2 text-center text-xs font-medium transition-colors sm:text-sm",
              preset === key
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]",
            )}
          >
            {t(`tutorials.intervalSimulator.presets.${key}`)}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted-foreground)]">
        {t("tutorials.intervalSimulator.ratioLabel", {
          base: Math.round(BASE_FREQUENCY),
          interval: Math.round(intervalFrequency),
          ratio:
            preset === "octave"
              ? "2:1"
              : preset === "fifth"
                ? "3:2"
                : "16:15",
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
