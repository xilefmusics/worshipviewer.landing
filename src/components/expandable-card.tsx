"use client";

import { ChevronDown } from "lucide-react";
import { useId, type ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ExpandableCard({
  id,
  title,
  summary,
  open,
  prefersHover,
  onToggle,
  onHover,
  children,
}: {
  id: string;
  title: string;
  summary?: string;
  open: boolean;
  prefersHover: boolean;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
  children: ReactNode;
}) {
  const detailsId = useId();

  return (
    <Card
      className={cn(
        "p-6 transition-[border-color,box-shadow] duration-200 motion-reduce:transition-none",
        open
          ? "border-[var(--color-primary)] shadow-[var(--shadow-elevated)]"
          : "border-[var(--color-border)]",
      )}
      onMouseEnter={() => {
        if (prefersHover) {
          onHover(id);
        }
      }}
      onMouseLeave={() => {
        if (prefersHover) {
          onHover(null);
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={(event) => {
          onToggle(id);
          if (open) {
            event.currentTarget.blur();
          }
        }}
        className="flex w-full items-start justify-between gap-3 rounded-md text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      >
        <span>
          <span className="block text-xl font-semibold leading-snug tracking-tight">
            {title}
          </span>
          {summary ? (
            <span className="mt-2 block text-sm font-normal leading-relaxed text-[var(--color-muted-foreground)]">
              {summary}
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "mt-1 size-4 shrink-0 text-[var(--color-muted-foreground)] transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        id={detailsId}
        role="region"
        aria-label={title}
        className={cn(
          "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
          open && "grid-rows-[1fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pt-3 text-sm text-[var(--color-muted-foreground)]">
            {children}
          </div>
        </div>
      </div>
    </Card>
  );
}
