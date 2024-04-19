import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const content = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  height: "100%",
});

export const previewFadeIn = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(2%)" },
  })} .5s`,
});
