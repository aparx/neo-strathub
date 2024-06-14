import { vars } from "@repo/theme";
import { blendState } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const list = style({
  listStyle: "none",
  display: "flex",
  flexDirection: "column",
  margin: `0 ${vars.spacing.sm}`,
});

export const item = recipe({
  base: {
    display: "flex",
    justifyContent: "space-between",
    padding: vars.spacing.md,
    cursor: "pointer",
  },
  variants: {
    self: {
      false: {
        ":hover": {
          background: vars.colors.state.hover.color,
        },
      },
      true: {
        background: vars.colors.primary.darkest,
        ":hover": {
          background: blendState(vars.colors.primary.darkest, "hover"),
        },
      },
    },
  },
});

export const color = style({
  width: "1em",
  height: "1em",
  borderRadius: "100%",
  border: `1px solid ${vars.colors.outline.card}`,
});
