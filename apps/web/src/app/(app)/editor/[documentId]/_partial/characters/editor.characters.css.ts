import { overlayBackground } from "@/app/(app)/editor/[documentId]/_partial/editor.css";
import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const CHARACTER_BOX_SIZE = 65;
export const GADGET_BOX_SIZE = 30;

export const list = style([
  overlayBackground,
  sprinkles({ outline: "card" }),
  {
    position: "absolute",
    bottom: vars.spacing["2xl"],
    left: "50%",
    transform: "translateX(-50%)",
    padding: vars.spacing.sm,
    borderRadius: vars.roundness.md,
    zIndex: 99,
    display: "flex",
    gap: vars.spacing.lg,
    animation: `${keyframes({
      from: { opacity: 0, transform: "translate(-50%, 50%)" },
    })} .5s`,
  },
]);

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
