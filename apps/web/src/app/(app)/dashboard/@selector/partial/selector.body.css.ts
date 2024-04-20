import { keyframes, style } from "@vanilla-extract/css";

export const slideIn = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(-2%)" },
  })} .5s forwards`,
});
