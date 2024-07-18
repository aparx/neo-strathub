import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export type ColorBoxVariants = RecipeVariants<typeof colorBox>;

export const colorBox = recipe({
  base: {
    height: "1em",
    aspectRatio: "1 / 1",
    borderRadius: vars.roundness.full,
  },
  variants: {
    mode: {
      fill: sprinkles({ outline: "card" }),
      stroke: {
        border: "2px solid transparent",
        background: "transparent",
      },
    },
  },
  defaultVariants: {
    mode: "fill",
  },
});

export const container = style({
  top: "100%",
  position: "absolute",
  padding: vars.spacing.md,
  background: vars.colors.accents[5],
  zIndex: 99,
  transformOrigin: "top left",
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateY(3px)", scale: 0 },
  })} .15s`,
});
