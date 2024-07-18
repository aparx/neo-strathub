import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const title = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const index = style({
  display: "grid",
  placeItems: "center",
  width: "1.5em",
  aspectRatio: "1 / 1",
  borderRadius: vars.roundness.sm,
});
