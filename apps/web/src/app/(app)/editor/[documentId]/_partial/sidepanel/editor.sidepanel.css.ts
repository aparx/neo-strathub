import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { EDITOR_HEADER_HEIGHT } from "../header/editor.header.css";

export const SIDEPANEL_WIDTH = "280px";

export const sidepanel = style([
  {
    position: "absolute",
    left: 0,
    top: EDITOR_HEADER_HEIGHT,
    width: SIDEPANEL_WIDTH,
    height: calc.subtract("100dvh", `${EDITOR_HEADER_HEIGHT}px`),
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
    padding: vars.spacing.md,
    overflowY: "auto",
    zIndex: 999,
    pointerEvents: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
    animation: `${keyframes({
      from: {
        opacity: 0,
        left: calc.negate(calc.multiply(SIDEPANEL_WIDTH, 0.25)),
      },
    })} .5s`,
  },
]);
