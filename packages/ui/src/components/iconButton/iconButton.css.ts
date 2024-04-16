import { vars } from "@repo/theme";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { blendState } from "../../utils";

const hoverOrFocusSelector =
  "&:not([disabled='true']):hover," + " &:not([disabled='true']):focus-visible";

export const button = recipe({
  base: {
    display: "grid",
    placeItems: "center",
    border: "transparent",
    outline: "none",
    padding: vars.spacing.sm,
    borderRadius: vars.roundness.sm,
  },
  variants: {
    color: {
      default: {
        color: vars.colors.emphasis.medium,
        background: "transparent",
        selectors: {
          [hoverOrFocusSelector]: {
            background: vars.colors.state.hover.color,
          },
        },
      },
      primary: {
        color: vars.colors.primary.base,
        background: vars.colors.primary.darkest,
        selectors: {
          [hoverOrFocusSelector]: {
            background: blendState(vars.colors.primary.darkest, "hover"),
          },
        },
      },
      warning: {
        color: vars.colors.warning.base,
        background: vars.colors.warning.darkest,
        selectors: {
          [hoverOrFocusSelector]: {
            background: blendState(vars.colors.warning.darkest, "hover"),
          },
        },
      },
      destructive: {
        color: vars.colors.destructive.base,
        background: vars.colors.destructive.darkest,
        selectors: {
          [hoverOrFocusSelector]: {
            background: blendState(vars.colors.destructive.darkest, "hover"),
          },
        },
      },
    },
    disabled: {
      false: {
        cursor: "pointer",
      },
      true: {
        opacity: vars.emphasis.low,
        pointerEvents: "none",
      },
    },
  },
  defaultVariants: {
    color: "default",
    disabled: false,
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
