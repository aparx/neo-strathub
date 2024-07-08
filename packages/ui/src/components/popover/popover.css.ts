import { sprinkles, vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";
import { blendAlpha, blendState } from "../../utils";

export const POPOVER_BACKGROUND = blendAlpha(vars.colors.accents[1], 0.8);
export const POPOVER_BACKDROP_FILTER = "blur(5px)";

const popoverBase = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
  background: POPOVER_BACKGROUND,
  backdropFilter: POPOVER_BACKDROP_FILTER,
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  margin: `0 ${vars.spacing.md}`,
  boxShadow: `0 2px ${vars.spacing.md} ${vars.colors.scrim}`,
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity, scale",
  minWidth: 150,
  zIndex: 9999,
});

export const popover = style([sprinkles({ outline: "card" }), popoverBase]);

export const arrow = style({ fill: POPOVER_BACKGROUND });

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
    from: { opacity: 0, transform: "translateX(2%)", scale },
  })}`,
});

globalStyle(`${popoverBase}[data-state='open'][data-side='right']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateX(-2%)", scale },
  })}`,
});

//* <=======> POPOVER.EXPAND <=======>

const expandShellBase = style({
  color: vars.colors.emphasis.high,
  fontWeight: "inherit",
});

export const expandShell = recipe({
  base: expandShellBase,
  variants: {
    fadeIn: {
      false: {},
      true: {
        willChange: "opacity, transform",
        animation: `${keyframes({
          from: { opacity: 0, transform: "translateY(75%)" },
        })} .2s`,
      },
    },
  },
  defaultVariants: {
    fadeIn: false,
  },
});

const expandIconBase = style({
  color: vars.colors.emphasis.high,
  transition: ".15s",
});

export const expandIcon = recipe({
  base: expandIconBase,
  variants: {
    fadeIn: {
      false: {
        willChange: "rotate",
      },
      true: {
        willChange: "opacity, transform, rotate",
        animation: `${keyframes({
          from: { opacity: 0, transform: "translateY(-50%)" },
        })} .33s`,
      },
    },
  },
  defaultVariants: {
    fadeIn: false,
  },
});

globalStyle(`${expandShellBase}[data-state='open'] ${expandIconBase}`, {
  rotate: "-180deg",
});

globalStyle(`${expandShellBase}[data-state='closed']:hover ${expandIconBase}`, {
  transform: "translateY(12.5%)",
});
