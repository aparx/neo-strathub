import { vars } from "@repo/theme";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const divider = recipe({
  base: {
    background: vars.colors.outline.card,
  },
  variants: {
    orient: {
      horizontal: {
        width: "100%",
        height: 1,
      },
      vertical: {
        width: 1,
        height: "100%",
      },
    },
  },
  defaultVariants: {
    orient: "horizontal",
  },
});

export type DividerVariants = RecipeVariants<typeof divider>;
