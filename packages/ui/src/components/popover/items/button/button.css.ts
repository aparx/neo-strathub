import { vars } from "@repo/theme";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";
import { blendAlpha, blendState } from "../../../../utils";

const destructiveBase = blendAlpha(vars.colors.destructive.darkest, 0.5);

const hoverFocusSelector =
  "&:not([aria-disabled]):hover, &:not([aria-disabled]):focus-visible";

export const button = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.md,
    padding: vars.spacing.md,
    border: "unset",
    background: "transparent",
    outline: "none",
  },
  variants: {
    color: {
      default: {
        color: vars.colors.emphasis.medium,
        selectors: {
          [hoverFocusSelector]: {
            color: vars.colors.emphasis.high,
            background: vars.colors.state.hover.color,
          },
        },
      },
      destructive: {
        background: destructiveBase,
        color: vars.colors.destructive.base,
        selectors: {
          [hoverFocusSelector]: {
            background: blendState(destructiveBase, "hover"),
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
      },
    },
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
    color: "default",
    disabled: false,
    size: "default",
  },
});

export type ButtonVariants = RecipeVariants<typeof button>;
