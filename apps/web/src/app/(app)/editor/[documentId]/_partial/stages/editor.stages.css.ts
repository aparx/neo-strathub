import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { overlayPartialBackground } from "../editor.css";

export const container = style([
  overlayPartialBackground,
  sprinkles({ outline: "card" }),
  {
    gridArea: "center",
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 99,
    padding: vars.spacing.sm,
    borderRadius: vars.roundness.full,
    animation: `${keyframes({ from: { opacity: 0 } })} .5s`,
    userSelect: "none",
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
    border: "unset",
  },
  variants: {
    active: {
      false: {
        color: vars.colors.emphasis.medium,
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

export const stagePrefix = sprinkles({
  display: {
    desktop: "inline",
    tablet: "none",
    mobile: "none",
  },
});

export const stageIconActive = style({
  animation: `${keyframes({ from: { scale: 0.5 } })} .33s`,
});
