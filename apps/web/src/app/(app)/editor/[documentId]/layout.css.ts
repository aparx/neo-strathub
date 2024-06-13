import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { EDITOR_HEADER_HEIGHT } from "./_partial/header/editor.header.css";

export const fadeInRect = style({
  position: "absolute",
  inset: 0,
  zIndex: 10,
  pointerEvents: "none",
  animation: `${keyframes({
    from: { opacity: 1, background: vars.colors.accents[0] },
    to: { opacity: 0, display: "none" },
  })} 2s`,
});

export const grid = style({
  position: "absolute",
  left: 0,
  right: 0,
  width: "100dvw",
  height: "100dvh",
  zIndex: 999,
  overflow: "hidden",
  display: "grid",
  gap: vars.spacing.md,
  gridTemplateColumns: "280px 1fr 280px",
  gridTemplateRows: `${EDITOR_HEADER_HEIGHT}px 1fr`,
  gridTemplateAreas: `
    'header header header'
    'lhs center rhs'
  `,
});
