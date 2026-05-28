export const CIRCLE_OF_FIFTHS_NOTES = [
  { label: "C", semitones: 0 },
  { label: "G", semitones: 7 },
  { label: "D", semitones: 2 },
  { label: "A", semitones: 9 },
  { label: "E", semitones: 4 },
  { label: "B", semitones: 11 },
  { label: "G♭", semitones: 6 },
  { label: "D♭", semitones: 1 },
  { label: "A♭", semitones: 8 },
  { label: "E♭", semitones: 3 },
  { label: "B♭", semitones: 10 },
  { label: "F", semitones: 5 },
] as const;

const CONTAINER_SIZE = 280;
const RADIUS = 96;

export function circleOfFifthsPosition(index: number): { x: number; y: number } {
  const angle =
    -Math.PI / 2 +
    (index / CIRCLE_OF_FIFTHS_NOTES.length) * 2 * Math.PI;
  return {
    x: 50 + (RADIUS / (CONTAINER_SIZE / 2)) * 50 * Math.cos(angle),
    y: 50 + (RADIUS / (CONTAINER_SIZE / 2)) * 50 * Math.sin(angle),
  };
}
