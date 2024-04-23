import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export const card = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      borderRadius: 9999,
      padding: vars.spacing.sm,
      paddingLeft: vars.spacing.md,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: vars.spacing.md,
    },
  ],
  variants: {
    color: {
      primary: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
      secondary: {
        background: vars.colors.secondary.darkest,
        color: vars.colors.secondary.lighter,
      },
      foreground: {
        background: vars.colors.accents[3],
        color: vars.colors.emphasis.medium,
      },
    },
  },
  defaultVariants: {
    color: "foreground",
  },
});

export type CardVariants = RecipeVariants<typeof card>;

export const priceTag = style({
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  background: vars.colors.overlay,
  borderRadius: vars.roundness.full,
  color: vars.colors.emphasis.medium,
  border: `1px solid ${vars.colors.outline.card}`,
});
