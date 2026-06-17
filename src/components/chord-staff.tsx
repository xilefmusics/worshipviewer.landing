import {
  STAFF_LAYOUT,
  noteToY,
  parseNote,
} from "@/lib/music-staff";
import {
  TREBLE_CLEF_DOT_PATH,
  TREBLE_CLEF_DOT_TRANSFORM,
  TREBLE_CLEF_G_ANCHOR_Y,
  TREBLE_CLEF_HEIGHT,
  TREBLE_CLEF_INNER_TRANSFORM,
  TREBLE_CLEF_PATH,
} from "@/lib/treble-clef-path";

export type ChordStaffNote =
  | string
  | {
      note: string;
      headSide?: "left" | "right";
    };

export type ChordStaffItem = {
  label: string;
  notes: ChordStaffNote[];
};

export function chordStaffNotePitch(note: ChordStaffNote): string {
  return typeof note === "string" ? note : note.note;
}

export function chordStaffNotesToPitches(notes: ChordStaffNote[]): string[] {
  return notes.map(chordStaffNotePitch);
}

type ChordStaffProps = {
  chords: ChordStaffItem[];
};

const NOTE_RX = 5.5;
const NOTE_RY = 4;
const STEM_LENGTH = 28;
const LEDGER_WIDTH = 18;
const STAFF_LEFT = 52;
const STAFF_RIGHT_PADDING = 24;
const CHORD_SLOT_WIDTH = 96;
const MIDDLE_LINE_Y = 60;
const TREBLE_CLEF_X = 6;

function TrebleClef({
  gLineY,
  lineSpacing,
}: {
  gLineY: number;
  lineSpacing: number;
}) {
  const clefHeight = lineSpacing * 6;
  const scale = clefHeight / TREBLE_CLEF_HEIGHT;

  return (
    <g
      transform={`translate(${TREBLE_CLEF_X}, ${gLineY - TREBLE_CLEF_G_ANCHOR_Y * scale}) scale(${scale})`}
      aria-hidden="true"
    >
      <g transform={TREBLE_CLEF_INNER_TRANSFORM}>
        <path d={TREBLE_CLEF_PATH} fill="currentColor" stroke="none" />
        <path
          d={TREBLE_CLEF_DOT_PATH}
          fill="currentColor"
          stroke="none"
          transform={TREBLE_CLEF_DOT_TRANSFORM}
        />
      </g>
    </g>
  );
}

function LedgerLines({
  x,
  steps,
  bottomLineY,
  lineSpacing,
}: {
  x: number;
  steps: number[];
  bottomLineY: number;
  lineSpacing: number;
}) {
  const ledgerSteps = new Set<number>();

  for (const step of steps) {
    if (step < STAFF_LAYOUT.minStep) {
      for (let ledger = -2; ledger >= step; ledger -= 2) {
        ledgerSteps.add(ledger);
      }
    }

    if (step > STAFF_LAYOUT.maxStep) {
      for (let ledger = 10; ledger <= step; ledger += 2) {
        ledgerSteps.add(ledger);
      }
    }
  }

  return (
    <>
      {[...ledgerSteps].map((step) => (
        <line
          key={step}
          x1={x - LEDGER_WIDTH / 2}
          y1={noteToY(step, bottomLineY, lineSpacing)}
          x2={x + LEDGER_WIDTH / 2}
          y2={noteToY(step, bottomLineY, lineSpacing)}
          stroke="currentColor"
          strokeWidth="1.2"
        />
      ))}
    </>
  );
}

function ChordBlock({
  x,
  notes,
  bottomLineY,
  lineSpacing,
}: {
  x: number;
  notes: ChordStaffNote[];
  bottomLineY: number;
  lineSpacing: number;
}) {
  const renderedNotes = notes.map((note) => ({
    pitch: chordStaffNotePitch(note),
    headSide: typeof note === "string" ? ("left" as const) : (note.headSide ?? "left"),
  }));
  const parsedNotes = renderedNotes.map((note) => parseNote(note.pitch));
  const yPositions = parsedNotes.map((note) =>
    noteToY(note.step, bottomLineY, lineSpacing),
  );
  const averageY =
    yPositions.reduce((sum, y) => sum + y, 0) / yPositions.length;
  const stemUp = averageY >= MIDDLE_LINE_Y;
  const topY = Math.min(...yPositions);
  const bottomY = Math.max(...yPositions);
  const stemX = x;
  const stemY1 = stemUp ? bottomY : topY;
  const stemY2 = stemUp ? topY - STEM_LENGTH : bottomY + STEM_LENGTH;

  return (
    <g>
      <LedgerLines
        x={x}
        steps={parsedNotes.map((note) => note.step)}
        bottomLineY={bottomLineY}
        lineSpacing={lineSpacing}
      />
      {yPositions.map((y, index) => {
        const headSide = renderedNotes[index].headSide;
        const noteX =
          headSide === "right" ? stemX + NOTE_RX : stemX - NOTE_RX;

        return (
        <ellipse
          key={`${renderedNotes[index].pitch}-${y}`}
          cx={noteX}
          cy={y}
          rx={NOTE_RX}
          ry={NOTE_RY}
          fill="currentColor"
        />
        );
      })}
      <line
        x1={stemX}
        y1={stemY1}
        x2={stemX}
        y2={stemY2}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  );
}

export function ChordStaff({ chords }: ChordStaffProps) {
  const { lineSpacing, bottomLineY } = STAFF_LAYOUT;
  const gLineY = bottomLineY - lineSpacing;
  const staffWidth =
    STAFF_LEFT + chords.length * CHORD_SLOT_WIDTH + STAFF_RIGHT_PADDING;
  const viewBoxHeight = 130;
  const staffLineStart = STAFF_LEFT - 4;
  const staffLineEnd = staffWidth - STAFF_RIGHT_PADDING;

  return (
    <figure className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-4">
      <svg
        viewBox={`0 0 ${staffWidth} ${viewBoxHeight}`}
        className="mx-auto h-auto min-w-[36rem] w-full max-w-3xl text-[var(--color-foreground)]"
        role="img"
        aria-label="Six basic chords in the key of C on a treble clef staff"
      >
        <TrebleClef gLineY={gLineY} lineSpacing={lineSpacing} />

        {Array.from({ length: 5 }, (_, index) => {
          const y = bottomLineY - index * lineSpacing;
          return (
            <line
              key={y}
              x1={staffLineStart}
              y1={y}
              x2={staffLineEnd}
              y2={y}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          );
        })}

        {chords.map((chord, index) => {
          const x = STAFF_LEFT + index * CHORD_SLOT_WIDTH + CHORD_SLOT_WIDTH / 2;

          return (
            <g key={chord.label}>
              <ChordBlock
                x={x}
                notes={chord.notes}
                bottomLineY={bottomLineY}
                lineSpacing={lineSpacing}
              />
              <text
                x={x}
                y={viewBoxHeight - 8}
                textAnchor="middle"
                className="fill-[var(--color-muted-foreground)] text-[11px] font-medium"
              >
                {chord.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}
