import { editorBackground } from "@/app/(app)/editor/[documentId]/_partial/editor.css";
import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const HEADER_HEIGHT = 50;

export const headerBackground = style([
  editorBackground,
  {
    position: "absolute",
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: HEADER_HEIGHT,
    zIndex: 99,
    width: "100%",
    paddingLeft: vars.spacing.lg,
    paddingRight: vars.spacing.lg,
  },
]);

export const titleTrigger = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: vars.spacing.sm,
  gap: vars.spacing.md,
  background: "transparent",
  border: "unset",
  color: "inherit",
  font: "inherit",
  letterSpacing: "inherit",
  cursor: "pointer",
  ":hover": {
    background: vars.colors.state.hover.color,
    borderRadius: vars.roundness.sm,
    color: vars.colors.emphasis.high,
  },
});

export const headerItem = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  variants: {
    side: {
      left: {
        flex: 1,
        justifyContent: "flex-start",
      },
      center: {
        width: "max-content",
      },
      right: {
        flex: 1,
        justifyContent: "flex-end",
      },
    },
  },
});
