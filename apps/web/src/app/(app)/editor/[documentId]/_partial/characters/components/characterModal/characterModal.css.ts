import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const gridContainer = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    flexDirection: "column",
    borderRadius: vars.roundness.sm,
    overflow: "hidden",
    gap: 1,
  },
]);

export const gridHeader = style({
  background: vars.colors.accents[3],
  width: "100%",
  padding: vars.spacing.md,
});

export const charGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(55px, 1fr))",
  gap: vars.spacing.md,
  maxHeight: 250,
  background: vars.colors.accents[2],
  padding: vars.spacing.md,
  overflowY: "auto",
  "::-webkit-scrollbar": {
    width: vars.spacing.sm,
    background: "transparent",
  },
  "::-webkit-scrollbar-thumb": {
    background: vars.colors.overlay,
    borderRadius: vars.roundness.full,
    width: 3,
  },
});

const gridItemBase = style({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  aspectRatio: "1 / 1",
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  content: "paint",
  background: vars.colors.accents[2],
  cursor: "pointer",
  selectors: {
    "&:hover::after": {
      content: "",
      position: "absolute",
      zIndex: 99,
      inset: 0,
      borderRadius: "inherit",
      background: vars.colors.state.hover.color,
      willChange: "opacity",
      animation: `${keyframes({
        from: { opacity: 0 },
      })} .15s`,
    },
  },
});

export const charGridItem = recipe({
  base: [sprinkles({ outline: "card" }), gridItemBase],
  variants: {
    active: {
      false: {},
      true: {
        background: vars.colors.primary.darker,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});
