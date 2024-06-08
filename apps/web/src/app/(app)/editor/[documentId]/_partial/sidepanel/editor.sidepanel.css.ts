import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { EDITOR_HEADER_HEIGHT } from "../header/editor.header.css";

export const sidepanel = style([
  {
    position: "absolute",
    left: 0,
    top: EDITOR_HEADER_HEIGHT,
    width: 280,
    height: calc.subtract("100dvh", `${EDITOR_HEADER_HEIGHT}px`),
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
    padding: vars.spacing.md,
    overflowY: "auto",
    zIndex: 999,
  },
]);
