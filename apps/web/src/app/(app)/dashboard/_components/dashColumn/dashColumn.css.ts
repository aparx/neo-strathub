import { DASHBOARD_GRID_GAP } from "@/app/(app)/dashboard/layout.css";
import { vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const partialPadding = vars.spacing.md;

export const HEADER_HEIGHT = calc.add(
  createLineHeight(vars.fontSizes.body.md),
  calc.multiply(4, vars.spacing.md),
  "2px",
);

const base = style({
  padding: partialPadding,
  background: vars.colors.accents[0],
});

export const root = style({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  gap: DASHBOARD_GRID_GAP,
});

export const header = style([
  base,
  {
    position: "sticky",
    top: 0,
    display: "flex",
    alignItems: "center",
    minHeight: HEADER_HEIGHT,
    flexBasis: HEADER_HEIGHT,
    flexShrink: 0,
    flexGrow: 0,
  },
]);

export const content = style([
  base,
  {
    overflowY: "auto",
    flexGrow: 1,
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      width: 0,
    },
  },
]);

export const footer = style([
  base,
  {
    flexGrow: 0,
    flexShrink: 0,
    position: "sticky",
    bottom: 0,
  },
]);
