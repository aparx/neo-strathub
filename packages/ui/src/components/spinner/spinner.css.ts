import { keyframes, style } from "@vanilla-extract/css";

export const spinner = style({
  animation: `${keyframes({
    to: { rotate: "360deg" },
  })} 1.75s linear infinite`,
});
