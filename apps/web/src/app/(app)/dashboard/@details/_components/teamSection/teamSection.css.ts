import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

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

export const upgradeButton = style({
  marginLeft: "auto",
  position: "relative",
  "::before": {
    content: "",
    position: "absolute",
    inset: 0,
    border: `3px solid ${vars.colors.emphasis.medium}`,
    borderRadius: "inherit",
    filter: "blur(2px)",
    animation: `${keyframes({
      "50%": {
        inset: 0,
        opacity: 1,
      },
      to: {
        opacity: 0,
        inset: calc.multiply(-1, vars.spacing.md),
      },
    })} 3s linear infinite`,
  },
});
