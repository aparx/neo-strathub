import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});
