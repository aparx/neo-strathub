import { keyframes, style } from "@vanilla-extract/css";

export const previewFadeIn = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(2%)" },
  })} .5s`,
});
