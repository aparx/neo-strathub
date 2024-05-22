import { sprinkles, vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const slot = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    position: "relative",
    gap: vars.spacing.md,
    padding: vars.spacing.sm,
    height: calc.add("30px", calc.multiply(2, vars.spacing.sm)),
    alignItems: "center",
    borderRadius: vars.roundness.md,
    overflow: "hidden",
    cursor: "pointer",
    selectors: {
      "&:hover::after": {
        content: "",
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        background: vars.colors.state.hover.color,
        pointerEvents: "none",
      },
    },
  },
]);

const indexSize = calc.add(
  createLineHeight("1em"),
  calc.multiply(2, vars.spacing.sm),
);

export const index = style({
  display: "flex",
  gap: vars.spacing.md,
  alignItems: "center",
  justifyContent: "center",
  minWidth: "max-content",
  width: indexSize,
  height: indexSize,
  flexGrow: 0,
  flexShrink: 0,
  borderRadius: vars.roundness.sm,
});

export const blob = style({
  background: "currentColor",
  width: vars.spacing.md,
  height: vars.spacing.md,
  borderRadius: "100%",
});

export const playerList = style({
  display: "flex",
  gap: vars.spacing.sm,
  userSelect: "none",
  overflowX: "auto",
  "::-webkit-scrollbar": {
    display: "none",
  },
});

export const player = style([
  sprinkles({ outline: "card" }),
  {
    color: vars.colors.emphasis.high,
    background: "rgba(0, 0, 0, .4)",
    borderRadius: vars.roundness.full,
    padding: vars.spacing.sm,
    paddingRight: vars.spacing.md,
    minWidth: "max-content",
  },
]);

export const slotList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});
