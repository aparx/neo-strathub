import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { recipe } from "@vanilla-extract/recipes";
import { overlayPartialBackground } from "../../../editor.css";

export const container = recipe({
  base: [
    sprinkles({ outline: "card" }),
    overlayPartialBackground,
    {
      display: "flex",
      flexDirection: "column",
      borderRadius: vars.roundness.sm,
      pointerEvents: "auto",
      clipPath: "stroke-box",
    },
  ],
  variants: {
    expanded: {
      false: {},
      true: {
        paddingBottom: vars.spacing.lg,
      },
    },
  },
  defaultVariants: {
    expanded: false,
  },
});

export const header = style({
  display: "flex",
  gap: vars.spacing.md,
  padding: vars.spacing.lg,
  justifyContent: "space-between",
  position: "relative",
});

export const expand = style({
  position: "absolute",
  right: calc.subtract(vars.spacing.lg, vars.spacing.sm),
  top: calc.subtract(vars.spacing.lg, vars.spacing.sm),
});
