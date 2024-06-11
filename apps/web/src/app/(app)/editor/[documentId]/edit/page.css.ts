import { style } from "@vanilla-extract/css";

export const loadingContainer = style({
  position: "absolute",
  zIndex: 90,
  display: "grid",
  placeItems: "center",
  inset: 0,
});
