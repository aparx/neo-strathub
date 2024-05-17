import { vars } from "@repo/theme";
import { blendAlpha } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";

export const overlayBackground = style({
  background: blendAlpha(vars.colors.accents[2], 0.85),
  backdropFilter: "blur(15px)",
});
