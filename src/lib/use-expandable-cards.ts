import { useCallback, useEffect, useState } from "react";

import { usePrefersHover } from "@/lib/use-prefers-hover";

export function useExpandableCards() {
  const prefersHover = usePrefersHover();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const openId = (prefersHover ? hoveredId : null) ?? expandedId;

  const onToggle = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedId(null);
        setHoveredId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return { openId, prefersHover, onToggle, onHover: setHoveredId };
}
