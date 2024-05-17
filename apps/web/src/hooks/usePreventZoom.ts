import { useRef } from "react";
import { useEventListener } from "usehooks-ts";

/**
 * Captures and prevents the `wheel` and `keydown` events that would potentially
 * trigger a change in scale (thus zoom) on the page.
 */
export function usePreventZoom() {
  const docRef = useRef<Document>(document);

  // prettier-ignore
  useEventListener("wheel", (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    e.stopPropagation();
  }, docRef, { passive: false });

  // prettier-ignore
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    if (!["+", "-", "="].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
  }, docRef, { passive: false });
}
