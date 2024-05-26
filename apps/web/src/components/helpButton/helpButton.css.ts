import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const trigger = style({
  color: vars.colors.emphasis.medium,
  background: "transparent",
  border: "none",
  position: "relative",
  transition: ".15s color",
  lineHeight: 0,
  ":hover": {
    color: vars.colors.emphasis.high,
  },
});

export const content = style({
  maxWidth: "45ch",
  zIndex: 99999,
});
