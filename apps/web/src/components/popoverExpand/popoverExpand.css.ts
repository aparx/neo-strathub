import { vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const buttonShellBase = style({
  color: `${vars.colors.emphasis.high} !important`,
  fontWeight: "inherit",
});

export const buttonShell = recipe({
  base: buttonShellBase,
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

const buttonIconBase = style({
  transition: ".15s",
});

export const buttonIcon = recipe({
  base: buttonIconBase,
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

globalStyle(`${buttonShellBase}[data-state='open'] ${buttonIconBase}`, {
  rotate: "-180deg",
});

globalStyle(`${buttonShellBase}[data-state='closed']:hover ${buttonIconBase}`, {
  transform: "translateY(12.5%)",
});
