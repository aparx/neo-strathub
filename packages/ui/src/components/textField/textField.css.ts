import { sprinkles, vars } from "@repo/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const shellBase = style({
  display: "flex",
  alignItems: "center",
  borderRadius: vars.roundness.md,
  padding: vars.spacing.md,
});

export const shell = recipe({
  base: [
    shellBase,
    sprinkles({
      outline: "card",
      gap: "sm",
    }),
  ],
  variants: {
    disabled: {
      true: {
        color: vars.colors.emphasis.medium,
        opacity: vars.emphasis.low,
      },
      false: {
        color: vars.colors.emphasis.medium,
        cursor: "text",
        selectors: {
          "&:hover, &:focus-within": {
            background: vars.colors.state.hover.color,
            color: vars.colors.emphasis.high,
          },
        },
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const input = style({
  display: "inline-block",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
});

globalStyle(`${input}::placeholder`, {
  color: vars.colors.emphasis.low,
});
