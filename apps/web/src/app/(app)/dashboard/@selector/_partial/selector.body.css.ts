import { keyframes, style } from "@vanilla-extract/css";

export const slideInFromRight = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(5%)" },
  })} .75s forwards`,
});

export const slideInFromLeft = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(-5%)" },
  })} .75s forwards`,
});
