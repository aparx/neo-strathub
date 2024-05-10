import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const trigger = style({
  color: vars.colors.emphasis.medium,
  background: "transparent",
  border: "none",
  selectors: {
    "&:hover::before": {
      width: "100%",
      height: "100%",
      background: vars.colors.state.hover.color,
      padding: vars.spacing.md,
    },
  },
});

export const content = style({
  maxWidth: "45ch",
});
