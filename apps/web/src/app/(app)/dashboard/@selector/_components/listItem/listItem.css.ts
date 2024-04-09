import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const listItem = recipe({
  base: sprinkles({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
        color: vars.colors.emphasis.medium,
        ":hover": {
          cursor: "pointer",
          background: vars.colors.state.hover.color,
          color: vars.colors.emphasis.high,
        },
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const itemIcon = style({
  position: "relative",
  padding: vars.spacing.md,
  borderRadius: vars.roundness.sm,
  background: vars.colors.overlay,
});
