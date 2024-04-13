import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

const sectionBase = style([
  sprinkles({
    outline: "card",
  }),
  {
    padding: vars.spacing.lg,
    gap: vars.spacing.lg,
  },
]);

export const main = style([
  sectionBase,
  {
    display: "flex",
    flexDirection: "column",
    borderRadius: vars.roundness.sm,
    borderBottomLeftRadius: "unset",
    borderBottomRightRadius: "unset",
  },
]);

export const annotation = style([
  sectionBase,
  {
    borderRadius: vars.roundness.sm,
    borderTopLeftRadius: "unset",
    borderTopRightRadius: "unset",
  },
]);
