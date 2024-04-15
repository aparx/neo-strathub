import { vars } from "@repo/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { createLineHeight } from "../../utils";

const breadcrumbBase = style({
  display: "flex",
  alignItems: "center",
  position: "relative",
  userSelect: "none",
  listStyle: "none",
  verticalAlign: "middle",
});

export const breadcrumb = recipe({
  base: breadcrumbBase,
  variants: {
    active: {
      true: { color: vars.colors.emphasis.high },
      false: { color: vars.colors.emphasis.medium },
    },
  },
});

globalStyle(`${breadcrumbBase} + li::before`, {
  content: "",
  display: "inline-block",
  height: createLineHeight(vars.fontSizes.label.sm),
  borderRight: `1px solid ${vars.colors.emphasis.low}`,
  rotate: "15deg",
  margin: `0 ${vars.spacing.lg}`,
});
