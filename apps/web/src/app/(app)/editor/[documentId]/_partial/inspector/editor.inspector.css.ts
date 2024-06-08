import { overlayPartialBackground } from "@/app/(app)/editor/[documentId]/_partial/editor.css.ts";
import { EDITOR_HEADER_HEIGHT } from "@/app/(app)/editor/[documentId]/_partial/header/editor.header.css.ts";
import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const INSPECTOR_WIDTH = 300;

export const inspectorContainer = style([
  overlayPartialBackground,
  {
    zIndex: 99,
    position: "absolute",
    top: EDITOR_HEADER_HEIGHT,
    right: 0,
    width: INSPECTOR_WIDTH,
    height: calc.subtract("100dvh", `${EDITOR_HEADER_HEIGHT}px`),
    borderLeft: `1px solid ${vars.colors.outline.card}`,
    padding: vars.spacing.lg,
    animation: `${keyframes({
      from: { right: -100, opacity: 0 },
    })} .5s`,
  },
]);
