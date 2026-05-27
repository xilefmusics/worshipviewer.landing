export const WAVE_WIDTH = 600;
export const WAVE_HEIGHT = 96;

export function buildSineWavePath(
  frequency: number,
  amplitude: number,
  phase: number,
  minFrequency: number,
  maxFrequency: number,
): string {
  const midY = WAVE_HEIGHT / 2;
  const ampPx = (WAVE_HEIGHT / 2 - 6) * amplitude;
  const minLog = Math.log(minFrequency);
  const maxLog = Math.log(maxFrequency);
  const cycles =
    2 + ((Math.log(frequency) - minLog) / (maxLog - minLog)) * 6;

  const segments: string[] = [];
  for (let x = 0; x <= WAVE_WIDTH; x += 2) {
    const t = x / WAVE_WIDTH;
    const y = midY - ampPx * Math.sin(2 * Math.PI * cycles * t + phase);
    segments.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }
  return segments.join(" ");
}

export function buildHarmonicWavePath(
  harmonicVolumes: number[],
  phase: number,
  amplitude: number,
): string {
  const midY = WAVE_HEIGHT / 2;
  const ampPx = (WAVE_HEIGHT / 2 - 6) * amplitude;
  const cycles = 3;

  const segments: string[] = [];
  for (let x = 0; x <= WAVE_WIDTH; x += 2) {
    const t = x / WAVE_WIDTH;
    let value = 0;
    let weightSum = 0;

    for (
      let harmonic = 1;
      harmonic < harmonicVolumes.length;
      harmonic += 1
    ) {
      const volume = harmonicVolumes[harmonic] ?? 0;
      if (volume <= 0) {
        continue;
      }
      value += volume * Math.sin(2 * Math.PI * cycles * harmonic * t + phase);
      weightSum += volume;
    }

    const normalized = weightSum > 0 ? value / weightSum : 0;
    const y = midY - ampPx * normalized;
    segments.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }
  return segments.join(" ");
}

export function buildDualWavePaths(
  baseFrequency: number,
  intervalFrequency: number,
  amplitude: number,
  phase: number,
): { base: string; interval: string } {
  const minFrequency = Math.min(baseFrequency, intervalFrequency) * 0.9;
  const maxFrequency = Math.max(baseFrequency, intervalFrequency) * 1.1;

  return {
    base: buildSineWavePath(
      baseFrequency,
      amplitude,
      phase,
      minFrequency,
      maxFrequency,
    ),
    interval: buildSineWavePath(
      intervalFrequency,
      amplitude * 0.85,
      phase,
      minFrequency,
      maxFrequency,
    ),
  };
}
