import { noteToFrequency } from "@/lib/music-staff";

export const CHORD_DURATION = 0.9;
export const CHORD_GAP = 0.2;
const NOTE_ATTACK = 0.02;
const NOTE_GAIN = 0.14;

export function playChord(
  audioContext: AudioContext,
  notes: string[],
  startTime: number,
  duration: number,
) {
  const endTime = startTime + duration;

  for (const note of notes) {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = noteToFrequency(note);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(NOTE_GAIN, startTime + NOTE_ATTACK);
    gain.gain.setValueAtTime(NOTE_GAIN, endTime - NOTE_ATTACK);
    gain.gain.linearRampToValueAtTime(0, endTime);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(endTime);
  }
}
