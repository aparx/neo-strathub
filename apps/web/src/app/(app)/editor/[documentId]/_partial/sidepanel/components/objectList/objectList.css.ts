import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const margin = style({
  margin: `0 ${vars.spacing.lg}`,
});

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});

export const list = style([
  margin,
  {
    display: "grid",
    gap: vars.spacing.md,
    gridTemplateColumns: "repeat(4, 1fr)",
    listStyle: "none",
  },
]);

export const item = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      aspectRatio: "1/1",
      borderRadius: vars.roundness.sm,
      position: "relative",
      padding: vars.spacing.sm,
    },
  ],
  variants: {
    loaded: {
      true: {
        background: vars.colors.accents[4],
        cursor: "pointer",
        selectors: {
          "&:hover::after": {
            //* Applies overlay on image + forces drag of the entire item
            content: "",
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: vars.colors.state.hover.color,
          },
        },
      },
      false: {
        background: vars.colors.emphasis.low,
      },
    },
  },
  defaultVariants: {
    loaded: false,
  },
});
