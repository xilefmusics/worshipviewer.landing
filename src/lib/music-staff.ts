const LETTER_TO_INDEX: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

const LETTER_TO_CHROMATIC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const CHROMATIC_SEMITONES = 12;
const C4_FREQUENCY = 261.63;

export type ParsedNote = {
  letter: string;
  octave: number;
  step: number;
};

export function parseNote(note: string): ParsedNote {
  const match = /^([A-G])(\d)$/.exec(note);
  if (!match) {
    throw new Error(`Invalid note: ${note}`);
  }

  const letter = match[1];
  const octave = Number(match[2]);
  const letterIndex = LETTER_TO_INDEX[letter];
  const step = (octave - 4) * 7 + (letterIndex - 2);

  return { letter, octave, step };
}

export function noteToY(
  step: number,
  bottomLineY: number,
  lineSpacing: number,
): number {
  return bottomLineY - step * (lineSpacing / 2);
}

export function noteToFrequency(note: string): number {
  const match = /^([A-G])([b#]?)(\d)$/.exec(note);
  if (!match) {
    throw new Error(`Invalid note: ${note}`);
  }

  const letter = match[1];
  const accidental = match[2];
  const octave = Number(match[3]);
  let semitone =
    (octave - 4) * CHROMATIC_SEMITONES + LETTER_TO_CHROMATIC[letter];

  if (accidental === "b") {
    semitone -= 1;
  } else if (accidental === "#") {
    semitone += 1;
  }

  return C4_FREQUENCY * 2 ** (semitone / CHROMATIC_SEMITONES);
}

export const STAFF_LAYOUT = {
  lineSpacing: 10,
  bottomLineY: 80,
  topLineY: 40,
  minStep: 0,
  maxStep: 8,
} as const;
