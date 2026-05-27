export const HARMONIC_COUNT = 12;
export const FUNDAMENTAL_FREQUENCY = 220;
export const MASTER_GAIN = 0.34;

export const HARMONIC_PRESET_KEYS = [
  "pure",
  "string",
  "brass",
  "clarinet",
  "flute",
  "organ",
] as const;

export type HarmonicPreset = (typeof HARMONIC_PRESET_KEYS)[number];

export type HarmonicVolumes = number[];

export type TimbreConfig = {
  volumes: HarmonicVolumes;
  inharmonicity: number;
  filterCutoff: number;
  filterQ: number;
  highpassCutoff: number;
  attack: number;
  release: number;
  vibratoRate: number;
  vibratoDepthCents: number;
  saturation: number;
  harmonicDetuneCents: number[];
};

function createVolumes(levels: number[]): HarmonicVolumes {
  const volumes: HarmonicVolumes = Array.from(
    { length: HARMONIC_COUNT + 1 },
    () => 0,
  );
  for (const [index, level] of levels.entries()) {
    volumes[index + 1] = level;
  }
  return volumes;
}

const DEFAULT_DETUNE = Array.from({ length: HARMONIC_COUNT + 1 }, () => 0);

export const TIMBRE_PRESETS: Record<HarmonicPreset, TimbreConfig> = {
  pure: {
    volumes: createVolumes([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
    inharmonicity: 0,
    filterCutoff: 12_000,
    filterQ: 0.4,
    highpassCutoff: 0,
    attack: 0.012,
    release: 0.06,
    vibratoRate: 0,
    vibratoDepthCents: 0,
    saturation: 0,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
  string: {
    volumes: createVolumes([
      1, 0.62, 0.41, 0.31, 0.24, 0.19, 0.16, 0.13, 0.11, 0.095, 0.082, 0.07,
    ]),
    inharmonicity: 0,
    filterCutoff: 4_800,
    filterQ: 0.85,
    highpassCutoff: 0,
    attack: 0.08,
    release: 0.14,
    vibratoRate: 5.2,
    vibratoDepthCents: 10,
    saturation: 0.35,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
  brass: {
    volumes: createVolumes([
      1, 0.42, 0.88, 0.34, 0.74, 0.24, 0.56, 0.16, 0.4, 0.1, 0.26, 0.07,
    ]),
    inharmonicity: 0,
    filterCutoff: 3_800,
    filterQ: 1.1,
    highpassCutoff: 0,
    attack: 0.055,
    release: 0.09,
    vibratoRate: 5.8,
    vibratoDepthCents: 14,
    saturation: 0.75,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
  clarinet: {
    volumes: createVolumes([
      1, 0.015, 0.74, 0.008, 0.5, 0.004, 0.33, 0.002, 0.2, 0, 0.11, 0,
    ]),
    inharmonicity: 0,
    filterCutoff: 2_600,
    filterQ: 1.2,
    highpassCutoff: 0,
    attack: 0.04,
    release: 0.08,
    vibratoRate: 5.5,
    vibratoDepthCents: 8,
    saturation: 0.25,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
  flute: {
    volumes: createVolumes([
      1, 0.18, 0.07, 0.03, 0.015, 0.008, 0.004, 0.002, 0.001, 0, 0, 0,
    ]),
    inharmonicity: 0,
    filterCutoff: 2_400,
    filterQ: 0.55,
    highpassCutoff: 200,
    attack: 0.06,
    release: 0.1,
    vibratoRate: 6.2,
    vibratoDepthCents: 18,
    saturation: 0.15,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
  organ: {
    volumes: createVolumes([
      1, 0.84, 0.7, 0.58, 0.5, 0.42, 0.36, 0.3, 0.25, 0.2, 0.16, 0.13,
    ]),
    inharmonicity: 0,
    filterCutoff: 6_500,
    filterQ: 0.65,
    highpassCutoff: 0,
    attack: 0.07,
    release: 0.05,
    vibratoRate: 6.5,
    vibratoDepthCents: 6,
    saturation: 0.3,
    harmonicDetuneCents: DEFAULT_DETUNE,
  },
};

export const PRESET_MATCH_EPSILON = 0.025;

export function volumesMatchPreset(
  volumes: HarmonicVolumes,
  preset: HarmonicPreset,
): boolean {
  return TIMBRE_PRESETS[preset].volumes.every((level, index) => {
    if (index === 0) {
      return true;
    }
    return Math.abs(level - (volumes[index] ?? 0)) <= PRESET_MATCH_EPSILON;
  });
}

export function detectPreset(volumes: HarmonicVolumes): HarmonicPreset | "custom" {
  for (const preset of HARMONIC_PRESET_KEYS) {
    if (volumesMatchPreset(volumes, preset)) {
      return preset;
    }
  }
  return "custom";
}

export function hasAudibleHarmonics(volumes: HarmonicVolumes): boolean {
  return volumes.slice(1).some((volume) => volume > 0);
}

export function harmonicFrequency(
  fundamental: number,
  harmonic: number,
  inharmonicity: number,
): number {
  if (inharmonicity <= 0) {
    return fundamental * harmonic;
  }
  return fundamental * harmonic * Math.sqrt(1 + inharmonicity * harmonic ** 2);
}

export function getNormalizedHarmonicGain(
  volumes: HarmonicVolumes,
  harmonic: number,
): number {
  const peak = Math.max(...volumes.slice(1), 0.001);
  return ((volumes[harmonic] ?? 0) / peak) * MASTER_GAIN;
}

export function getTimbreForPlayback(
  preset: HarmonicPreset | "custom",
): TimbreConfig {
  if (preset === "custom") {
    return TIMBRE_PRESETS.string;
  }
  return TIMBRE_PRESETS[preset];
}

export function makeSoftClipCurve(amount: number): Float32Array<ArrayBuffer> {
  const samples = 2048;
  const curve = new Float32Array(samples);
  const drive = Math.max(0, amount);

  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / samples - 1;
    curve[index] = ((1 + drive) * x) / (1 + drive * Math.abs(x));
  }

  return curve;
}

export type HarmonicVoiceNodes = {
  oscillators: (OscillatorNode | null)[];
  gains: (GainNode | null)[];
  masterGain: GainNode;
  lowpass: BiquadFilterNode;
  highpass: BiquadFilterNode | null;
  shaper: WaveShaperNode | null;
  vibratoOscillator: OscillatorNode | null;
  vibratoGain: GainNode | null;
};

export async function createHarmonicVoice(
  audioContext: AudioContext,
  volumes: HarmonicVolumes,
  timbre: TimbreConfig,
): Promise<HarmonicVoiceNodes> {
  const masterGain = audioContext.createGain();
  const lowpass = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;

  lowpass.type = "lowpass";
  lowpass.frequency.value = timbre.filterCutoff;
  lowpass.Q.value = timbre.filterQ;

  let highpass: BiquadFilterNode | null = null;
  if (timbre.highpassCutoff > 0) {
    highpass = audioContext.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = timbre.highpassCutoff;
    highpass.Q.value = 0.7;
  }

  let shaper: WaveShaperNode | null = null;
  if (timbre.saturation > 0) {
    shaper = audioContext.createWaveShaper();
    shaper.curve = makeSoftClipCurve(timbre.saturation * 2.5);
    shaper.oversample = "2x";
  }

  let outputNode: AudioNode = lowpass;
  if (highpass) {
    lowpass.connect(highpass);
    outputNode = highpass;
  }
  if (shaper) {
    outputNode.connect(shaper);
    outputNode = shaper;
  }
  outputNode.connect(masterGain);
  masterGain.connect(audioContext.destination);

  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(1, now + timbre.attack);

  const oscillators: (OscillatorNode | null)[] = Array.from(
    { length: HARMONIC_COUNT + 1 },
    () => null,
  );
  const gains: (GainNode | null)[] = Array.from(
    { length: HARMONIC_COUNT + 1 },
    () => null,
  );

  let vibratoOscillator: OscillatorNode | null = null;
  let vibratoGain: GainNode | null = null;

  if (timbre.vibratoDepthCents > 0 && timbre.vibratoRate > 0) {
    vibratoOscillator = audioContext.createOscillator();
    vibratoGain = audioContext.createGain();
    vibratoOscillator.type = "sine";
    vibratoOscillator.frequency.value = timbre.vibratoRate;
    vibratoGain.gain.value = timbre.vibratoDepthCents;
    vibratoOscillator.connect(vibratoGain);
    vibratoOscillator.start(now);
  }

  for (let harmonic = 1; harmonic <= HARMONIC_COUNT; harmonic += 1) {
    const level = getNormalizedHarmonicGain(volumes, harmonic);
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = harmonicFrequency(
      FUNDAMENTAL_FREQUENCY,
      harmonic,
      timbre.inharmonicity,
    );
    oscillator.detune.value = timbre.harmonicDetuneCents[harmonic] ?? 0;
    gain.gain.value = level;

    oscillator.connect(gain);
    gain.connect(lowpass);
    oscillator.start(now);

    if (vibratoGain) {
      vibratoGain.connect(oscillator.detune);
    }

    oscillators[harmonic] = oscillator;
    gains[harmonic] = gain;
  }

  return {
    oscillators,
    gains,
    masterGain,
    lowpass,
    highpass,
    shaper,
    vibratoOscillator,
    vibratoGain,
  };
}

export function updateHarmonicVoiceLevels(
  voice: Pick<HarmonicVoiceNodes, "gains">,
  volumes: HarmonicVolumes,
): void {
  for (let harmonic = 1; harmonic <= HARMONIC_COUNT; harmonic += 1) {
    const gain = voice.gains[harmonic];
    if (gain) {
      gain.gain.value = getNormalizedHarmonicGain(volumes, harmonic);
    }
  }
}

export function releaseHarmonicVoice(
  audioContext: AudioContext,
  voice: HarmonicVoiceNodes,
  timbre: TimbreConfig,
  onComplete: () => void,
): void {
  const now = audioContext.currentTime;
  voice.masterGain.gain.cancelScheduledValues(now);
  voice.masterGain.gain.setValueAtTime(
    Math.max(voice.masterGain.gain.value, 0.001),
    now,
  );
  voice.masterGain.gain.exponentialRampToValueAtTime(
    0.001,
    now + timbre.release,
  );

  globalThis.window.setTimeout(onComplete, timbre.release * 1000 + 80);
}

export function disposeHarmonicVoice(voice: HarmonicVoiceNodes): void {
  voice.vibratoOscillator?.stop();
  voice.vibratoOscillator?.disconnect();
  voice.vibratoGain?.disconnect();

  for (const oscillator of voice.oscillators) {
    oscillator?.stop();
    oscillator?.disconnect();
  }
  for (const gain of voice.gains) {
    gain?.disconnect();
  }

  voice.lowpass.disconnect();
  voice.highpass?.disconnect();
  voice.shaper?.disconnect();
  voice.masterGain.disconnect();
}
