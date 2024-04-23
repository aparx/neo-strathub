import { sprinkles, vars } from "@repo/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const shellBase = style({
  display: "flex",
  alignItems: "center",
  borderRadius: vars.roundness.md,
  padding: vars.spacing.md,
  position: "relative",
  overflow: "hidden",
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
    state: {
      default: {
        color: vars.colors.emphasis.medium,
        cursor: "text",
      },
      error: {
        color: vars.colors.emphasis.medium,
        cursor: "text",
        borderColor: vars.colors.destructive.lighter,
      },
      disabled: {
        color: vars.colors.emphasis.medium,
        opacity: vars.emphasis.low,
      },
    },
  },
  defaultVariants: {
    state: "default",
  },
});

export const input = style({
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "inherit",
  fontFamily: "inherit",
  fontSize: "inherit",
  letterSpacing: "inherit",
  lineHeight: "inherit",
});

export const error = style({
  color: vars.colors.destructive.lighter,
  margin: `${vars.spacing.sm} 0`,
});

globalStyle(`${input}::placeholder`, {
  color: vars.colors.emphasis.low,
});

globalStyle(
  `${shellBase}:not([data-state='disabled']):hover, 
   ${shellBase}:not([data-state='disabled']):focus-within`,
  {
    background: vars.colors.state.hover.color,
    color: vars.colors.emphasis.high,
  },
);
