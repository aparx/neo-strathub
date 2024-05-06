import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const group = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.sm,
    background: vars.colors.accents[2],
    padding: vars.spacing.sm,
    borderRadius: vars.roundness.md,
    overflow: "hidden",
  },
]);

export const label = recipe({
  base: {
    padding: vars.spacing.md,
    display: "flex",
    justifyContent: "space-between",
    gap: vars.spacing.md,
    borderRadius: vars.roundness.sm,
    willChange: "color, background",
    transition: ".15s",
  },
  variants: {
    selected: {
      false: {
        ":hover": {
          background: vars.colors.state.hover.color,
          cursor: "pointer",
        },
      },
      true: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
    },
  },
  defaultVariants: {
    selected: false,
  },
});
