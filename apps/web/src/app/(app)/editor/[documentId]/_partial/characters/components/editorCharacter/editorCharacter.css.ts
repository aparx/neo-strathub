import {
  CHARACTER_BOX_SIZE,
  GADGET_BOX_SIZE,
} from "@/app/(app)/editor/[documentId]/_partial/characters/editor.characters.css";
import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const characterButton = style({
  background: "unset",
  border: "unset",
  display: "flex",
  gap: 3,
});

export const characterBox = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      position: "relative",
      width: CHARACTER_BOX_SIZE,
      height: CHARACTER_BOX_SIZE,
      borderRadius: vars.roundness.sm,
      border: `1px solid ${vars.colors.outline.card}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: vars.colors.accents[3],
      fontSize: "2em",
      cursor: "pointer",
      selectors: {
        "&:hover::after": {
          content: "",
          position: "absolute",
          inset: 0,
          background: vars.colors.state.hover.color,
          borderRadius: "inherit",
        },
      },
    },
  ],
  variants: {
    active: {
      false: {
        color: vars.colors.emphasis.low,
      },
      true: {
        color: vars.colors.emphasis.high,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});

export const gadgetList = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.sm,
});

export const gadgetBox = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      position: "relative",
      listStyle: "none",
      width: GADGET_BOX_SIZE,
      height: GADGET_BOX_SIZE,
      background: vars.colors.accents[4],
      borderRadius: vars.roundness.sm,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      selectors: {
        "&:hover::after": {
          content: "",
          position: "absolute",
          inset: 0,
          background: vars.colors.state.hover.color,
          borderRadius: "inherit",
        },
      },
    },
  ],
  variants: {
    active: {
      false: {
        color: vars.colors.emphasis.low,
      },
      true: {
        color: vars.colors.emphasis.high,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});
