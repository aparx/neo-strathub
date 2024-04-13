import { sprinkles, vars } from "@repo/theme";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export const callout = recipe({
  base: [
    sprinkles({
      outline: "card",
    }),
    {
      display: "flex",
      alignItems: "center",
      gap: vars.spacing.md,
      padding: vars.spacing.lg,
      borderRadius: vars.roundness.sm,
    },
  ],
  variants: {
    color: {
      warning: {
        background: vars.colors.warning.darkest,
        color: vars.colors.warning.lighter,
      },
      destructive: {
        background: vars.colors.destructive.darkest,
        color: vars.colors.destructive.lighter,
      },
      primary: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
      secondary: {
        background: vars.colors.secondary.darkest,
        color: vars.colors.secondary.lighter,
      },
    },
  },
});

export type CalloutVariants = RecipeVariants<typeof callout>;
