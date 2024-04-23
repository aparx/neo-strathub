import { vars } from "@repo/theme";
import { keyframes } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { recipe } from "@vanilla-extract/recipes";

const height = calc.multiply(4, vars.spacing.xl);

export const gradient = recipe({
  base: {
    position: "absolute",
    inset: 0,
    bottom: "unset",
    height,
    opacity: 1 / 3,
    pointerEvents: "none",
    willChange: "height, opacity",
    animation: `${keyframes({
      from: { height: calc.divide(height, 2), opacity: 0 },
    })} 1s`,
  },
  variants: {
    color: {
      primary: {
        background: createGradient(vars.colors.primary.darkest),
      },
      secondary: {
        background: createGradient(vars.colors.secondary.darkest),
      },
      foreground: {
        background: createGradient(vars.colors.accents[5]),
      },
    },
  },
  defaultVariants: {
    color: "foreground",
  },
});

function createGradient(color: string) {
  return `linear-gradient(to bottom, ${color}, transparent)` as const;
}
