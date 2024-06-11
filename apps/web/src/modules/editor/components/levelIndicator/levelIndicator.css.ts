import { vars } from "@repo/theme";
import { recipe } from "@vanilla-extract/recipes";

export const indicator = recipe({
  base: {
    position: "absolute",
    width: 20,
    height: 20,
    display: "grid",
    placeItems: "center",
    background: vars.colors.accents[5],
    transform: "translate(50%, 50%)",
    borderRadius: 2,
  },
  variants: {
    focused: {
      false: {
        color: vars.colors.emphasis.medium,
      },
      true: {
        color: vars.colors.emphasis.high,
      },
    },
  },
  defaultVariants: {
    focused: false,
  },
});
