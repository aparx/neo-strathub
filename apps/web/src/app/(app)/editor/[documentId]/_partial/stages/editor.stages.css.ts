import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { recipe } from "@vanilla-extract/recipes";
import { overlayPartialBackground } from "../editor.css";
import { EDITOR_HEADER_HEIGHT } from "../header/editor.header.css";

export const container = style([
  overlayPartialBackground,
  sprinkles({ outline: "card" }),
  {
    position: "absolute",
    top: calc.add(`${EDITOR_HEADER_HEIGHT}px`, vars.spacing.lg),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99,
    padding: vars.spacing.sm,
    borderRadius: vars.roundness.full,
  },
]);

export const stageList = style({
  display: "flex",
  listStyle: "none",
  gap: vars.spacing.sm,
});

export const stageItem = recipe({
  base: {
    display: "flex",
    gap: vars.spacing.sm,
    alignItems: "center",
    listStyle: "none",
    padding: vars.spacing.md,
    borderRadius: vars.roundness.full,
  },
  variants: {
    active: {
      false: {
        color: vars.emphasis.medium,
        ":hover": {
          background: vars.colors.state.hover.color,
          color: vars.colors.emphasis.high,
          cursor: "pointer",
        },
      },
      true: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
    },
  },
  defaultVariants: {
    active: false,
  },
});
