import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const shell = style({
  background: vars.colors.accents[0],
  height: "100%",
});

export const container = style({
  animation: `${keyframes({
    from: {
      opacity: 0,
      transform: "translateX(2%)",
    },
  })} 1s`,
});
