import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const content = style({
  position: "relative",
  width: "100dvw",
  height: "100dvh",
  overflow: "hidden",
});

export const fadeInRect = style({
  position: "absolute",
  inset: 0,
  zIndex: 10,
  pointerEvents: "none",
  animation: `${keyframes({
    from: { opacity: 1, background: vars.colors.accents[0] },
    to: { opacity: 0, display: "none" },
  })} 1.5s`,
});
