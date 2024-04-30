import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const field = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
});
