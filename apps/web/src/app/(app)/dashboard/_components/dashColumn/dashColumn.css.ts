import { vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const partialPadding = vars.spacing.md;

export const HEADER_HEIGHT = calc.add(
  createLineHeight(vars.fontSizes.body.md),
  calc.multiply(4, vars.spacing.md),
);

const base = style({
  padding: partialPadding,
  background: "rgba(0, 0, 0, 0.8)",
  border: `1px solid ${vars.colors.outline.card}`,
});

export const root = style({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
});

export const header = style([
  base,
  {
    position: "sticky",
    display: "flex",
    alignItems: "center",
    minHeight: HEADER_HEIGHT,
    top: 0,
  },
]);

export const content = style([
  base,
  {
    overflowY: "auto",
    flexGrow: 1,
    borderTop: "unset",
    borderBottom: "unset",
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      width: 0,
    },
  },
]);

export const footer = style([
  base,
  {
    position: "sticky",
    bottom: 0,
  },
]);
