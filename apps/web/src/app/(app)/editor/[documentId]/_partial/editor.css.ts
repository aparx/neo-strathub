import { vars } from "@repo/theme";
import { blendAlpha } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";

export const editorBackground = style({
  background: blendAlpha(vars.colors.accents[2], 0.8),
  backdropFilter: "blur(15px)",
  borderBottom: `1px solid ${vars.colors.outline.card}`,
});
