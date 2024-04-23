import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const field = style({
  display: "grid",
  gap: vars.spacing.md,
  gridTemplateColumns: ".5fr 1fr",
  alignItems: "center",
  padding: vars.spacing.sm,
  paddingLeft: vars.spacing.md,
  background: vars.colors.accents[2],
  borderRadius: vars.roundness.sm,
  color: vars.colors.emphasis.medium,
});

export const slot = style({
  display: "flex",
  gap: vars.spacing.md,
  width: "100%",
});
