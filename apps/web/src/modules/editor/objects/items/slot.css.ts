import { sprinkles, vars } from "@repo/theme";
import { blendState } from "@repo/ui/utils";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { recipe } from "@vanilla-extract/recipes";

const buttonBase = style({
  position: "relative",
  height: `100%`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.sm,
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
});

export const button = recipe({
  base: [sprinkles({ outline: "card" }), buttonBase],
  variants: {
    disabled: {
      false: {
        cursor: "pointer",
      },
      true: {
        opacity: vars.emphasis.low,
        cursor: "unset",
      },
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

globalStyle(
  `${buttonBase}:focus-visible::after, 
   ${buttonBase}:hover::after`,
  {
    content: "",
    position: "absolute",
    inset: 0,
    borderRadius: "inherit",
    background: vars.colors.state.hover.base,
    filter: "invert(1)",
    opacity: 0.15,
  },
);

export const selector = style([
  sprinkles({ outline: "card" }),
  {
    position: "absolute",
    alignItems: "center",
    right: 0,
    bottom: "100%",
    display: "flex",
    gap: vars.spacing.xs,
    background: vars.colors.accents[2],
    padding: vars.spacing.xs,
    borderRadius: calc.add(vars.roundness.sm, vars.spacing.xs),
    transformOrigin: "right bottom",
    animation: `${keyframes({
      from: {
        opacity: 0,
        transform: "translateY(3px)",
        scale: 0,
      },
    })} .15s`,
  },
]);

export const selectorItem = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: vars.spacing.sm,
      width: "2em",
      height: "2em",
      borderRadius: vars.roundness.sm,
      background: vars.colors.accents[4],
      cursor: "pointer",
    },
  ],
  variants: {
    active: {
      false: {
        fontWeight: 500,
        ":hover": {
          background: blendState(vars.colors.accents[4], "hover"),
        },
      },
      true: {
        fontWeight: 700,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});
