import { sprinkles, vars } from "@repo/theme";
import { calc } from "@vanilla-extract/css-utils";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { blendState } from "../../utils";

const hoverOrFocusSelector = `
  &:not([aria-disabled='true']):hover,
  &:not([aria-disabled='true']):focus-visible
` as const;

export const button = recipe({
  base: [
    sprinkles({
      paddingX: "lg",
      paddingY: "md",
      borderRadius: "md",
      outline: "card",
    }),
    {
      display: "flex",
      gap: vars.spacing.md,
      width: "fit-content",
      alignItems: "center",
      textDecoration: "none",
    },
  ],
  variants: {
    disabled: {
      true: { opacity: vars.emphasis.low, pointerEvents: "none" },
      false: { cursor: "pointer", transition: "100ms" },
    },
    color: {
      default: {
        background: "transparent",
        color: vars.colors.emphasis.medium,
        selectors: {
          [hoverOrFocusSelector]: {
            color: vars.colors.emphasis.high,
            background: vars.colors.state.hover.color,
          },
        },
      },
      destructive: {
        background: vars.colors.destructive.darker,
        color: vars.colors.emphasis.high,
        selectors: {
          [hoverOrFocusSelector]: {
            background: blendState(vars.colors.destructive.darker, "hover"),
          },
        },
      },
      cta: {
        background: vars.colors.foreground,
        color: vars.colors.accents[0],
        fontWeight: `600 !important`,
        selectors: {
          [hoverOrFocusSelector]: {
            opacity: calc.multiply(vars.emphasis.high, 0.85),
          },
        },
      },
    },
    appearance: {
      default: {},
      cta: {
        borderRadius: `${vars.roundness.full} !important`,
      },
      icon: {
        padding: `${vars.spacing.md} !important`,
        aspectRatio: "1.75 / 1", // TODO
      },
    },
  },
  defaultVariants: {
    disabled: false,
    color: "default",
    appearance: "default",
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
