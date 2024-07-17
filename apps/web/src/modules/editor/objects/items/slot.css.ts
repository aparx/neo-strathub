import { sprinkles, vars } from "@repo/theme";
import { recipe } from "@vanilla-extract/recipes";

export const button = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      fontWeight: 700,
      height: `100%`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: vars.spacing.sm,
      padding: vars.spacing.sm,
      borderRadius: vars.roundness.sm,
    },
  ],
  variants: {
    disabled: {
      false: {},
      true: {
        opacity: vars.emphasis.low,
        cursor: "unset",
      },
    },
  },
});
