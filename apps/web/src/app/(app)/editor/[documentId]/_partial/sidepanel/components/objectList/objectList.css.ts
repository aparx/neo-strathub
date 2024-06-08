import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const margin = style({
  margin: `0 ${vars.spacing.lg}`,
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});

export const list = style([
  margin,
  {
    display: "grid",
    gap: vars.spacing.md,
    gridTemplateColumns: "repeat(4, 1fr)",
    listStyle: "none",
  },
]);

export const item = style({
  aspectRatio: "1/1",
  background: vars.colors.emphasis.low,
  borderRadius: vars.roundness.sm,
});
