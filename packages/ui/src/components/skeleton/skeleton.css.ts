import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const back = vars.colors.accents[5];
const front = vars.colors.emphasis.low;
const blurRadius = 40;

export const skeleton = style({
  position: "relative",
  background: back,
  overflow: "hidden",
  "::after": {
    content: "",
    position: "absolute",
    width: "max(20px, 10%)",
    height: "200%",
    top: "50%",
    transform: "translateY(-50%)",
    rotate: "33deg",
    filter: `blur(${blurRadius}px)`,
    background: front,
    animation: `${keyframes({
      from: {
        left: calc.subtract("-100%", `${blurRadius}px`),
      },
      to: {
        left: calc.add("100%", `${blurRadius}px`),
      },
    })} 1s infinite`,
  },
});
