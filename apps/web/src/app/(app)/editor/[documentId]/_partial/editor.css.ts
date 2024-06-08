import { vars } from "@repo/theme";
import { blendAlpha } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";

export const overlayHeaderBackground = style({
  background: blendAlpha(vars.colors.accents[2], 0.9),
  backdropFilter: "blur(15px)",
});

export const overlayPartialBackground = style({
  background: blendAlpha(vars.colors.accents[1], 0.95),
  backdropFilter: "blur(15px)",
});
