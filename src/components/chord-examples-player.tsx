"use client";

import type { ChordStaffItem } from "@/components/chord-staff";
import { ChordPlayer } from "@/components/chord-player";
import { MajorMinorPlayer } from "@/components/major-minor-player";

type ChordExamplesPlayerProps = {
  chords: ChordStaffItem[];
};

export function ChordExamplesPlayer({ chords }: ChordExamplesPlayerProps) {
  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      <MajorMinorPlayer embedded />
      <div className="mt-4 border-t border-[var(--color-border)] pt-4">
        <ChordPlayer chords={chords} embedded />
      </div>
    </div>
  );
}
