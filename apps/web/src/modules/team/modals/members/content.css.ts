import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const table = style({
  overflowY: "auto",
  maxHeight: 300, // TODO magic number
});

export const memberRow = recipe({
  variants: {
    highlight: {
      false: {},
      true: {
        background: vars.colors.accents[3],
      },
    },
  },
  defaultVariants: {
    highlight: false,
  },
});
