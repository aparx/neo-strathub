import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const group = style({
  display: "flex",
  gap: vars.spacing.sm,
  overflowX: "auto",
  "::-webkit-scrollbar": {
    height: 3,
    background: vars.colors.accents[3],
  },
  "::-webkit-scrollbar-thumb": {
    background: vars.colors.emphasis.medium,
  },
});

export const option = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      flexShrink: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: vars.roundness.md,
      padding: vars.spacing.md,
      transition: "150ms",
      willChange: "color, background",
      cursor: "pointer",
    },
  ],
  variants: {
    checked: {
      false: {
        color: vars.colors.emphasis.medium,
      },
      true: {
        background: vars.colors.primary.darker,
        color: "red",
      },
    },
  },
});
