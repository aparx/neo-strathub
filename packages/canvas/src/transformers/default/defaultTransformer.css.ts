import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const OVERLAY_HEIGHT = 35;

export const overlay = style({
  position: "absolute",
  height: OVERLAY_HEIGHT,
  transformOrigin: "left top",
  width: "max-content",
  maxWidth: "90dvw",
  background: vars.colors.accents[2],
  borderRadius: `calc(${vars.roundness.sm} + ${vars.spacing.xs})`,
  padding: vars.spacing.xs,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  color: vars.colors.emphasis.medium,
  border: `1px solid ${vars.colors.emphasis.low}`,
  overflowX: "auto",
  overflowY: "hidden",
  animation: `${keyframes({
    from: { opacity: 0, transform: "translate(-50%, 3px)" },
  })} .15s`,
  "::-webkit-scrollbar": {
    display: "none",
  },
});
