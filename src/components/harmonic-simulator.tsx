"use client";

import { Play, Square } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  HARMONIC_COUNT,
  HARMONIC_PRESET_KEYS,
  TIMBRE_PRESETS,
  type HarmonicPreset,
  type HarmonicVoiceNodes,
  type HarmonicVolumes,
  createHarmonicVoice,
  detectPreset,
  disposeHarmonicVoice,
  getTimbreForPlayback,
  hasAudibleHarmonics,
  releaseHarmonicVoice,
  updateHarmonicVoiceLevels,
} from "@/lib/harmonic-timbre";
import {
  WAVE_HEIGHT,
  WAVE_WIDTH,
  buildHarmonicWavePath,
} from "@/lib/wave-math";

export function HarmonicSimulator() {
  const { t } = useTranslation();
  const presetId = useId();
  const [harmonicVolumes, setHarmonicVolumes] = useState<HarmonicVolumes>(
    () => [...TIMBRE_PRESETS.pure.volumes],
  );
  const [timbrePreset, setTimbrePreset] = useState<HarmonicPreset | "custom">(
    "pure",
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const voiceRef = useRef<HarmonicVoiceNodes | null>(null);
  const animationRef = useRef<number | null>(null);
  const isStoppingRef = useRef(false);

  const activePreset = detectPreset(harmonicVolumes);

  const tearDownAudio = useCallback(() => {
    if (voiceRef.current) {
      disposeHarmonicVoice(voiceRef.current);
      voiceRef.current = null;
    }
    void audioContextRef.current?.close();
    audioContextRef.current = null;
  }, []);

  const stopPlayback = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (isStoppingRef.current) {
      return;
    }

    const audioContext = audioContextRef.current;
    const voice = voiceRef.current;

    if (!audioContext || !voice) {
      tearDownAudio();
      setIsPlaying(false);
      return;
    }

    isStoppingRef.current = true;
    const timbre = getTimbreForPlayback(timbrePreset);

    releaseHarmonicVoice(audioContext, voice, timbre, () => {
      tearDownAudio();
      isStoppingRef.current = false;
      setIsPlaying(false);
    });
  }, [tearDownAudio, timbrePreset]);

  const startPlayback = async () => {
    if (!hasAudibleHarmonics(harmonicVolumes) || isStoppingRef.current) {
      return;
    }

    tearDownAudio();
    isStoppingRef.current = false;

    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    await audioContext.resume();

    const timbre = getTimbreForPlayback(timbrePreset);
    voiceRef.current = await createHarmonicVoice(
      audioContext,
      harmonicVolumes,
      timbre,
    );
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && voiceRef.current) {
      updateHarmonicVoiceLevels(voiceRef.current, harmonicVolumes);
    }
  }, [harmonicVolumes, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      setPhase((current) => current + delta * 220 * 0.05);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => () => {
    isStoppingRef.current = false;
    tearDownAudio();
  }, [tearDownAudio]);

  const wavePath = buildHarmonicWavePath(
    harmonicVolumes,
    isPlaying ? phase : 0,
    0.5,
  );

  const setHarmonicVolume = (harmonic: number, volume: number) => {
    setHarmonicVolumes((current) => {
      const next = [...current];
      next[harmonic] = volume;
      const matched = detectPreset(next);
      if (matched !== "custom") {
        setTimbrePreset(matched);
      }
      return next;
    });
  };

  const applyPreset = (preset: HarmonicPreset) => {
    setTimbrePreset(preset);
    setHarmonicVolumes([...TIMBRE_PRESETS[preset].volumes]);
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
          d={wavePath}
          fill="none"
          className="stroke-[var(--color-primary)]"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12"
        role="group"
        aria-label={t("tutorials.harmonicSimulator.harmonicLevels")}
      >
        {Array.from({ length: HARMONIC_COUNT }, (_, index) => {
          const harmonic = index + 1;
          const volume = harmonicVolumes[harmonic] ?? 0;
          const sliderId = `${presetId}-harmonic-${harmonic}`;

          return (
            <div
              key={harmonic}
              className="flex min-w-0 flex-col items-center gap-1"
            >
              <input
                id={sliderId}
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round(volume * 100)}
                aria-label={t("tutorials.harmonicSimulator.harmonicVolume", {
                  harmonic,
                })}
                onChange={(event) =>
                  setHarmonicVolume(harmonic, Number(event.target.value) / 100)
                }
                className={cn(
                  "h-20 w-full max-w-[2.5rem] cursor-pointer appearance-none rounded-full sm:h-24",
                  "bg-[var(--color-border)] accent-[var(--color-primary)]",
                  "[writing-mode:vertical-lr] [direction:rtl]",
                )}
              />
              <span className="text-xs font-medium">{harmonic}×</span>
              <span className="text-[10px] tabular-nums text-[var(--color-muted-foreground)]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="sm"
          disabled={!hasAudibleHarmonics(harmonicVolumes)}
          onClick={() => {
            if (isPlaying) {
              stopPlayback();
              return;
            }
            void startPlayback();
          }}
          aria-label={
            isPlaying
              ? t("tutorials.harmonicSimulator.stop")
              : t("tutorials.harmonicSimulator.play")
          }
        >
          {isPlaying ? (
            <Square className="size-3.5" />
          ) : (
            <Play className="size-3.5" />
          )}
          {isPlaying
            ? t("tutorials.harmonicSimulator.stop")
            : t("tutorials.harmonicSimulator.play")}
        </Button>

        <label
          htmlFor={presetId}
          className="flex min-w-[12rem] flex-1 items-center gap-2 text-sm"
        >
          <span className="shrink-0 text-[var(--color-muted-foreground)]">
            {t("tutorials.harmonicSimulator.preset")}
          </span>
          <select
            id={presetId}
            value={activePreset}
            onChange={(event) => {
              const value = event.target.value;
              if (value !== "custom" && value in TIMBRE_PRESETS) {
                applyPreset(value as HarmonicPreset);
              }
            }}
            className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-foreground)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            {HARMONIC_PRESET_KEYS.map((preset) => (
              <option key={preset} value={preset}>
                {t(`tutorials.harmonicSimulator.presets.${preset}`)}
              </option>
            ))}
            {activePreset === "custom" ? (
              <option value="custom">
                {t("tutorials.harmonicSimulator.presets.custom")}
              </option>
            ) : null}
          </select>
        </label>
      </div>
    </div>
  );
}
