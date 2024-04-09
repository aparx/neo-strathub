import { sprinkles, vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const listItem = recipe({
  base: sprinkles({
    padding: "sm",
    outline: "card",
    borderRadius: "md",
    gap: "md",
  }),
  variants: {
    active: {
      true: {
        background: vars.colors.primary.darker,
        color: vars.colors.emphasis.high,
      },
      false: {
        background: "transparent",
        ":hover": {
          cursor: "pointer",
          background: vars.colors.state.hover.color,
        },
      },
    },
  },
});

export const itemIcon = style({
  position: "relative",
  padding: vars.spacing.md,
  borderRadius: vars.roundness.sm,
  background: vars.colors.overlay,
  fontSize: createLineHeight(vars.fontSizes.body.lg),
});
