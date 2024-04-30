import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const avatar = style({
  position: "relative",
  borderRadius: "100%",
  aspectRatio: "1 / 1",
  background: vars.colors.emphasis.low,
  overflow: "hidden",
});

export const image = style({
  objectFit: "fill",
  objectPosition: "center",
});
