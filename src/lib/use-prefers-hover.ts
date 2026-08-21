import { useEffect, useState } from "react";

export function usePrefersHover() {
  const [prefersHover, setPrefersHover] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const update = () => setPrefersHover(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersHover;
}
