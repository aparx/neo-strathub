import { useEventListener } from "usehooks-ts";

export function useDenyZoom() {
  // prettier-ignore
  useEventListener("wheel", (e: WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    e.stopPropagation();
  }, window, { passive: false });

  // prettier-ignore
  useEventListener("keydown", (e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    if (!["+", "-", "="].includes(e.key)) return;
    e.preventDefault();
    e.stopPropagation();
  }, window, { passive: false });
}
