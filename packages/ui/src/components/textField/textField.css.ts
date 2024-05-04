import { sprinkles, vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

const shellBase = style({
  display: "flex",
  alignItems: "center",
  borderRadius: vars.roundness.md,
  padding: vars.spacing.md,
  position: "relative",
  overflow: "hidden",
});

export const root = style({});

export const textLabel = style({
  marginBottom: vars.spacing.sm,
  color: vars.colors.emphasis.medium,
  transition: ".15s",
});

export const asterisk = style({
  color: vars.colors.emphasis.low,
});

globalStyle(`${root}[data-state='default']:focus-within ${textLabel}`, {
  color: vars.colors.emphasis.high,
});

globalStyle(`${root}[data-state='error'] ${textLabel}`, {
  color: vars.colors.destructive.lighter,
});

globalStyle(`${root}[data-state='disabled'] ${textLabel}`, {
  color: vars.colors.emphasis.low,
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
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(-2px)" },
  })} .25s`,
});

export const errorIcon = style({
  animation: `${keyframes({
    from: { rotate: "180deg", opacity: 0, scale: ".5" },
  })} .25s`,
});

globalStyle(`${input}::placeholder`, {
  color: vars.colors.emphasis.low,
});

globalStyle(
  `${root}:not([data-state='disabled']):hover ${shellBase}, 
   ${root}:not([data-state='disabled']):focus-within ${shellBase}`,
  {
    background: vars.colors.state.hover.color,
    color: vars.colors.emphasis.high,
  },
);
