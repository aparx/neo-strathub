import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const table = style({
  overflowY: "auto",
  maxHeight: 300, // TODO magic number
});

export const avatar = style({
  width: "1.3em",
  height: "1.3em",
  aspectRatio: "1 / 1",
  background: vars.colors.emphasis.low,
  borderRadius: vars.roundness.full,
});
