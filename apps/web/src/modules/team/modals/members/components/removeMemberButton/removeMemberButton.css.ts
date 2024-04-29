import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const trigger = style({
  margin: "auto",
});

export const footer = style({
  marginLeft: "auto",
  display: "flex",
  gap: vars.spacing.md,
});
