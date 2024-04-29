import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const field = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.md,
  },
  variants: {
    highlight: {
      false: {
        color: vars.colors.emphasis.medium,
      },
      true: {
        color: vars.colors.emphasis.high,
      },
    },
  },
});

export const avatar = style({
  width: "1.3em",
  height: "1.3em",
  aspectRatio: "1 / 1",
  background: vars.colors.emphasis.low,
  borderRadius: vars.roundness.full,
});
