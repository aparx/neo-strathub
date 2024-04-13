import { style } from "@vanilla-extract/css";
import { vars } from "@repo/theme";

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});