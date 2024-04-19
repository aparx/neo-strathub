import { vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const LAYOUT_HEADER_HEIGHT = calc.add(
  createLineHeight(vars.fontSizes.label.lg),
  calc.multiply(2, vars.spacing.lg),
);

export const header = style({
  display: "flex",
  alignItems: "center",
  padding: `0 ${vars.spacing.md}`,
  background: vars.colors.accents[0],
  height: LAYOUT_HEADER_HEIGHT,
  flexBasis: LAYOUT_HEADER_HEIGHT,
  flexShrink: 0,
  flexGrow: 0,
});
