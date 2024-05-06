import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const header = style({
  display: "flex",
  gap: vars.spacing.lg,
  flexDirection: "column",
});

export const game = style({
  display: "grid",
  placeItems: "center",
  padding: vars.spacing.md,
  background: vars.colors.accents[3],
  borderRadius: vars.roundness.sm,
});

export const exit = style({
  position: "absolute",
  marginLeft: "auto",
  top: calc.negate(vars.spacing.sm),
  right: calc.negate(vars.spacing.sm),
});

export const tags = style({
  width: "100%",
  overflowX: "auto",
  overflowY: "hidden",
  display: "flex",
  gap: vars.spacing.sm,
  "::-webkit-scrollbar": {
    display: "none",
  },
});

export const tag = style({
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  background: vars.colors.accents[3],
  borderRadius: vars.roundness.sm,
  color: vars.colors.emphasis.medium,
  userSelect: "none",
  flexShrink: 0,
});
