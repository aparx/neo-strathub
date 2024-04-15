import { sprinkles, vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { blendAlpha, blendState } from "../../utils";

export const POPOVER_BACKGROUND = blendAlpha(vars.colors.accents[1], 0.8);
export const POPOVER_BACKDROP_FILTER = "blur(10px)";

const destructiveBase = blendAlpha(vars.colors.destructive.darkest, 0.5);

const popoverBase = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  background: POPOVER_BACKGROUND,
  backdropFilter: POPOVER_BACKDROP_FILTER,
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  overflow: "hidden",
  margin: `0 ${vars.spacing.md}`,
  boxShadow: `0 0 4px ${vars.colors.scrim}`,
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity, scale",
});

export const popover = style([sprinkles({ outline: "card" }), popoverBase]);

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

export const item = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.md,
    padding: vars.spacing.md,
    borderRadius: vars.roundness.sm,
    border: "unset",
    background: "transparent",
    outline: "none",
  },
  variants: {
    color: {
      default: {
        color: vars.colors.emphasis.medium,
        selectors: {
          "&:not([aria-disabled]):hover": {
            color: vars.colors.emphasis.high,
          },
        },
      },
      destructive: {
        background: destructiveBase,
        color: vars.colors.destructive.base,
        selectors: {
          "&:not([aria-disabled]):hover": {
            background: blendState(destructiveBase, "hover"),
          },
        },
      },
    },
    disabled: {
      false: {
        ":hover": {
          cursor: "pointer",
          background: vars.colors.state.hover.color,
        },
      },
      true: {
        opacity: vars.emphasis.low,
      },
    },
  },
  defaultVariants: {
    color: "default",
    disabled: false,
  },
});

export type ItemVariants = RecipeVariants<typeof item>;

const scale = 0.98;

globalStyle(`${popoverBase}[data-state='open'][data-side='top']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateY(-2%)", scale },
  })}`,
});

globalStyle(`${popoverBase}[data-state='open'][data-side='bottom']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateY(2%)", scale },
  })}`,
});

globalStyle(`${popoverBase}[data-state='open'][data-side='left']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateX(-2%)", scale },
  })}`,
});

globalStyle(`${popoverBase}[data-state='open'][data-side='right']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateX(2%)", scale },
  })}`,
});