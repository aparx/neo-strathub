import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const body = style({
  background: vars.colors.accents[0],
  color: vars.colors.emphasis.high,
});

export const pageSuspense = style({
  display: "grid",
  placeItems: "center",
  position: "absolute",
  inset: 0,
  background: vars.colors.accents[0],
  zIndex: 9999,
});
