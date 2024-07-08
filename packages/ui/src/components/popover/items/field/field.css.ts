import { sprinkles, vars } from "@repo/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

const labelBase = style([
  sprinkles({
    outline: "card",
  }),
  {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.md,
    borderRadius: vars.roundness.sm,
    color: vars.colors.emphasis.medium,
  },
]);

export const label = recipe({
  base: labelBase,
  variants: {
    size: {
      default: {
        padding: vars.spacing.md,
      },
      compact: {
        padding: `${vars.spacing.sm} ${vars.spacing.md}`,
      },
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export type FieldVariants = RecipeVariants<typeof label>;

globalStyle(
  `${labelBase} > input::-webkit-outer-spin-button,
${labelBase} > input::-webkit-inner-spin-button`,
  {
    margin: 0,
    appearance: "none",
  },
);

globalStyle(`${labelBase} > input[type="number"]`, {
  appearance: "textfield",
});

globalStyle(`${labelBase} > input`, {
  background: "unset",
  border: "unset",
  font: "inherit",
  letterSpacing: "inherit",
  color: vars.colors.emphasis.medium,
  outline: "unset",
});

globalStyle(`${labelBase} > input:focus-visible`, {
  color: vars.colors.emphasis.high,
});
