"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MIN_FREQUENCY = 220;
const MAX_FREQUENCY = 880;
const DEFAULT_FREQUENCY = 440;
const MIN_AMPLITUDE = 0;
const MAX_AMPLITUDE = 1;
const DEFAULT_AMPLITUDE = 0.5;
const WAVE_WIDTH = 600;
const WAVE_HEIGHT = 96;

function frequencyToSlider(frequency: number): number {
  const minLog = Math.log(MIN_FREQUENCY);
  const maxLog = Math.log(MAX_FREQUENCY);
  return ((Math.log(frequency) - minLog) / (maxLog - minLog)) * 100;
}

function sliderToFrequency(slider: number): number {
  const minLog = Math.log(MIN_FREQUENCY);
  const maxLog = Math.log(MAX_FREQUENCY);
  return Math.exp(minLog + (slider / 100) * (maxLog - minLog));
}

function buildWavePath(
  frequency: number,
  amplitude: number,
  phase: number,
): string {
  const midY = WAVE_HEIGHT / 2;
  const ampPx = (WAVE_HEIGHT / 2 - 6) * amplitude;
  const minLog = Math.log(MIN_FREQUENCY);
  const maxLog = Math.log(MAX_FREQUENCY);
  const cycles =
    2 + ((Math.log(frequency) - minLog) / (maxLog - minLog)) * 6;

  const segments: string[] = [];
  for (let x = 0; x <= WAVE_WIDTH; x += 2) {
    const t = x / WAVE_WIDTH;
    const y =
      midY - ampPx * Math.sin(2 * Math.PI * cycles * t + phase);
    segments.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }
  return segments.join(" ");
}

function formatFrequency(frequency: number): string {
  return `${Math.round(frequency)} Hz`;
}

function formatAmplitude(amplitude: number): string {
  return `${Math.round(amplitude * 100)}%`;
}

export function ToneSimulator() {
  const { t } = useTranslation();
  const frequencyId = useId();
  const amplitudeId = useId();
  const [frequency, setFrequency] = useState(DEFAULT_FREQUENCY);
  const [amplitude, setAmplitude] = useState(DEFAULT_AMPLITUDE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const stopPlayback = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    oscillatorRef.current = null;
    gainRef.current?.disconnect();
    gainRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    setIsPlaying(false);
  }, []);

  const startPlayback = async () => {
    stopPlayback();

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = amplitude * 0.35;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequency;
    }
    if (gainRef.current) {
      gainRef.current.gain.value = amplitude * 0.35;
    }
  }, [frequency, amplitude]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setPhase((current) => current + delta * frequency * 0.05);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, frequency]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const wavePath = buildWavePath(frequency, amplitude, isPlaying ? phase : 0);

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
          d={wavePath}
          fill="none"
          className="stroke-[var(--color-primary)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="mt-4 space-y-3">
        <label
          htmlFor={frequencyId}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
        >
          <span className="min-w-[5.5rem] shrink-0 text-[var(--color-muted-foreground)]">
            {t("tutorials.toneSimulator.frequency")}
          </span>
          <input
            id={frequencyId}
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={frequencyToSlider(frequency)}
            onChange={(event) =>
              setFrequency(sliderToFrequency(Number(event.target.value)))
            }
            className={cn(
              "h-2 min-w-[8rem] flex-1 cursor-pointer appearance-none rounded-full",
              "bg-[var(--color-border)] accent-[var(--color-primary)]",
            )}
          />
          <span className="w-14 shrink-0 text-right font-medium tabular-nums">
            {formatFrequency(frequency)}
          </span>
        </label>

        <label
          htmlFor={amplitudeId}
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
        >
          <span className="min-w-[5.5rem] shrink-0 text-[var(--color-muted-foreground)]">
            {t("tutorials.toneSimulator.amplitude")}
          </span>
          <input
            id={amplitudeId}
            type="range"
            min={MIN_AMPLITUDE * 100}
            max={MAX_AMPLITUDE * 100}
            step={1}
            value={amplitude * 100}
            onChange={(event) =>
              setAmplitude(Number(event.target.value) / 100)
            }
            className={cn(
              "h-2 min-w-[8rem] flex-1 cursor-pointer appearance-none rounded-full",
              "bg-[var(--color-border)] accent-[var(--color-primary)]",
            )}
          />
          <span className="w-14 shrink-0 text-right font-medium tabular-nums">
            {formatAmplitude(amplitude)}
          </span>
        </label>
      </div>

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
              ? t("tutorials.toneSimulator.stop")
              : t("tutorials.toneSimulator.play")
          }
        >
          {isPlaying ? (
            <Square className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
          {isPlaying
            ? t("tutorials.toneSimulator.stop")
            : t("tutorials.toneSimulator.play")}
        </Button>
      </div>
    </div>
  );
}
