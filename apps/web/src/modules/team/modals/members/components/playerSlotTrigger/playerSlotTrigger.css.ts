import { sprinkles, vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { recipe } from "@vanilla-extract/recipes";

const slotBase = style({
  position: "relative",
  display: "flex",
  gap: vars.spacing.md,
  alignItems: "center",
  padding: "unset",
  paddingRight: vars.spacing.sm,
  width: 100,
  borderRadius: vars.roundness.sm,
  overflow: "hidden",
});

export const slot = recipe({
  base: [sprinkles({ outline: "card" }), slotBase],
  variants: {
    disabled: {
      false: {
        cursor: "pointer",
        selectors: {
          "&:hover::after": {
            content: "",
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: vars.colors.state.hover.color,
          },
        },
      },
      true: {},
    },
    active: {
      true: {},
      false: {
        background: vars.colors.accents[3],
        color: vars.colors.emphasis.low,
      },
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
  },
});

export const number = style({
  width: calc.add("1em", calc.multiply(2, vars.spacing.sm)),
  height: calc.add("1em", calc.multiply(2, vars.spacing.sm)),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const arrow = style({
  lineHeight: 0,
  marginLeft: "auto",
  color: vars.colors.emphasis.medium,
  opacity: 0,
});

globalStyle(`${slotBase}:not([data-disabled='true']):hover ${arrow}`, {
  animation: `${keyframes({
    from: { transform: "translateY(2px)" },
    to: { opacity: 1 },
  })} .15s forwards`,
});
