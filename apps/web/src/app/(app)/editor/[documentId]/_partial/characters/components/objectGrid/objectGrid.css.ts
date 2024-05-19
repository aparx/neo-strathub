import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const noneFound = style({
  position: "absolute",
  color: vars.colors.emphasis.low,
});

export const gridRoot = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    flexDirection: "column",
    borderRadius: vars.roundness.sm,
    overflow: "hidden",
    gap: 1,
  },
]);

export const gridContainer = style({
  overflowY: "auto",
  background: vars.colors.accents[2],
  padding: vars.spacing.md,
  maxHeight: 250,
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

export const gridHeader = style({
  background: vars.colors.accents[3],
  width: "100%",
  padding: vars.spacing.md,
});

export const gridContent = style({
  position: "relative",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(55px, 1fr))",
  gap: vars.spacing.md,
});

export const gridItem = style({
  position: "relative",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  aspectRatio: "1 / 1",
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  content: "paint",
  background: vars.colors.accents[2],
  border: `1px solid ${vars.colors.outline.card}`,
  color: vars.colors.emphasis.medium,
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

export const emptyLine = style({
  height: "100%",
  width: 2,
  rotate: "45deg",
  background: vars.colors.emphasis.medium,
});
