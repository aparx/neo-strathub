import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const OVERLAY_HEIGHT = 40;

export const overlay = style({
  position: "absolute",
  height: OVERLAY_HEIGHT,
  transformOrigin: "left top",
  width: "max-content",
  background: vars.colors.accents[2],
  borderRadius: vars.roundness.sm,
  padding: `${vars.spacing.sm} ${vars.spacing.sm}`,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  color: vars.colors.emphasis.medium,
  border: `1px solid ${vars.colors.emphasis.low}`,
  contain: "paint",
});
