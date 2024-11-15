import { vars } from "@repo/theme";
import { recipe } from "@vanilla-extract/recipes";

export const indicator = recipe({
  base: {
    position: "absolute",
    width: "max-content",
    minWidth: 20,
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
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
    },
  },
  defaultVariants: {
    focused: false,
  },
});
