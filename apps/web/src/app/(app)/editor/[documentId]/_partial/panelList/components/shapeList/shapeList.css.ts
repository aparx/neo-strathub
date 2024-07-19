import { sprinkles, vars } from "@repo/theme";
import { blendState } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";

export const list = style({
  display: "flex",
  gap: vars.spacing.sm,
  padding: `0 ${vars.spacing.lg}`,
  listStyle: "none",
});

export const shape = style([
  sprinkles({ outline: "card" }),
  {
    margin: 0,
    padding: vars.spacing.sm,
    fontSize: "1.5em",
    background: vars.colors.accents[4],
    borderRadius: vars.roundness.sm,
    color: vars.colors.emphasis.medium,
    ":hover": {
      background: blendState(vars.colors.accents[4], "hover"),
      color: vars.colors.emphasis.high,
      cursor: "pointer",
    },
  },
]);
