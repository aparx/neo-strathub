import { overlayBackground } from "@/app/(app)/editor/[documentId]/_partial/editor.css";
import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

export const HEADER_HEIGHT = 50;

export const headerContainer = style([
  overlayBackground,
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
    animation: `${keyframes({
      from: { opacity: 0, transform: "translateY(-50%)" },
    })} 1s`,
    borderBottom: `1px solid ${vars.colors.outline.card}`,
  },
]);

export const headerItem = recipe({
  base: {
    display: "flex",
    alignItems: "center",
  },
  variants: {
    side: {
      center: {
        width: "max-content",
      },
      left: {
        flex: 1,
        justifyContent: "flex-start",
      },
      right: {
        flex: 1,
        justifyContent: "flex-end",
      },
    },
  },
});
