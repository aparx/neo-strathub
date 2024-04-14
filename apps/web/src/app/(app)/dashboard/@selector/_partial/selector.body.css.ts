import { keyframes, style } from "@vanilla-extract/css";

export const slideIn = style({
  animation: `${keyframes({
    from: { opacity: 0, transform: "translateX(5%)" },
  })} .75s forwards`,
});
