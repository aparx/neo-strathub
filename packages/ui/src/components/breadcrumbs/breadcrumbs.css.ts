import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const breadcrumb = recipe({
  base: { userSelect: "none" },
  variants: {
    active: {
      true: { color: vars.colors.emphasis.high },
      false: { color: vars.colors.emphasis.medium },
    },
  },
});

export const divider = style({
  color: vars.colors.emphasis.low,
  fontWeight: 300,
  userSelect: "none",
});
