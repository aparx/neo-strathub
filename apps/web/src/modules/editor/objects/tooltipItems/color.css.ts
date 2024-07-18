import { sprinkles, vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export type ColorBoxVariants = RecipeVariants<typeof colorBox>;

export const colorBox = recipe({
  base: {
    height: "1em",
    aspectRatio: "1 / 1",
    borderRadius: vars.roundness.full,
  },
  variants: {
    mode: {
      fill: sprinkles({ outline: "card" }),
      stroke: {
        border: "2px solid transparent",
        background: "transparent",
      },
    },
  },
  defaultVariants: {
    mode: "fill",
  },
});

export const container = style({
  top: "100%",
  position: "absolute",
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  background: vars.colors.accents[3],
  zIndex: 99,
  transformOrigin: "top left",
  animation: `${keyframes({
    from: { opacity: 0, transform: "translate(3px)", scale: 0.75 },
  })} .15s`,
  boxShadow: `0 0 ${vars.spacing.sm} ${vars.colors.accents[3]}`,
});

export const picker = style({
  gap: vars.spacing.sm,
});

globalStyle(`${picker} .react-colorful__saturation`, {
  borderRadius: `${vars.roundness.sm} !important`,
  borderBottomLeftRadius: `0 !important`,
});

globalStyle(
  `${picker} .react-colorful__saturation-pointer,
   ${picker} .react-colorful__hue-pointer,
   ${picker} .react-colorful__alpha-pointer`,
  {
    width: "1em",
    height: "1em",
  },
);

globalStyle(
  `${picker} .react-colorful__hue, 
   ${picker} .react-colorful__alpha`,
  {
    height: "1.25em",
    borderRadius: vars.roundness.xs,
  },
);
