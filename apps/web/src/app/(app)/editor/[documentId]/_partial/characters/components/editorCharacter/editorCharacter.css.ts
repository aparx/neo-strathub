import {
  CHARACTER_BOX_SIZE,
  GADGET_BOX_SIZE,
} from "@/app/(app)/editor/[documentId]/_partial/characters/editor.characters.css";
import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const CHARACTER_INDEX_SIZE = "1.6em";

export const characterButton = style({
  background: "unset",
  padding: 0,
  border: "unset",
  display: "flex",
  gap: 3,
});

export const characterBox = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      position: "relative",
      padding: vars.spacing.md,
      width: CHARACTER_BOX_SIZE,
      height: CHARACTER_BOX_SIZE,
      borderRadius: vars.roundness.sm,
      border: `1px solid ${vars.colors.outline.card}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: vars.colors.accents[3],
      fontSize: "2em",
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
    editable: {
      false: {},
      true: {
        selectors: {
          "&:hover::after": {
            content: "",
            cursor: "pointer",
            position: "absolute",
            inset: 0,
            background: vars.colors.state.hover.color,
            borderRadius: "inherit",
          },
        },
      },
    },
  },
  defaultVariants: {
    active: false,
    editable: false,
  },
});

export const characterIndex = style([
  sprinkles({ outline: "card" }),
  {
    position: "absolute",
    zIndex: 99,
    top: `calc(${CHARACTER_INDEX_SIZE} / -4)`,
    left: `calc(${CHARACTER_INDEX_SIZE} / -4)`,
    display: "grid",
    placeItems: "center",
    background: vars.colors.accents[5],
    width: CHARACTER_INDEX_SIZE,
    height: CHARACTER_INDEX_SIZE,
    borderRadius: "100%",
    color: vars.colors.emphasis.medium,
  },
]);

export const characterImage = style({
  objectFit: "contain",
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
    },
  ],
  variants: {
    empty: {
      false: {
        color: vars.colors.emphasis.medium,
      },
      true: {
        opacity: vars.emphasis.low,
        color: vars.colors.emphasis.medium,
      },
    },
    editable: {
      false: {},
      true: {
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
    },
  },
  defaultVariants: {
    empty: false,
    editable: false,
  },
});
