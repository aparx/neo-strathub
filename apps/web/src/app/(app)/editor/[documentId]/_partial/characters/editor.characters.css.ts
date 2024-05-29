import { overlayHeaderBackground } from "@/app/(app)/editor/[documentId]/_partial/editor.css";
import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const CHARACTER_BOX_SIZE = 65;
export const GADGET_BOX_SIZE = 30;

export const list = style([
  overlayHeaderBackground,
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
