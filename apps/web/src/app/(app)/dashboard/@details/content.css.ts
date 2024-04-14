import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});
