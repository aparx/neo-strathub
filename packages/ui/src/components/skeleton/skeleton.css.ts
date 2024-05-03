import { vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { blendColors } from "../../utils";

const back = vars.colors.accents[5];
const front = blendColors(vars.colors.foreground, `${back} 90%`);

export const skeleton = style({
  height: "100%",
  width: "100%",
  background: back,
  backgroundImage: `linear-gradient(-45deg, transparent 25%, ${front}, transparent 75%)`,
  backgroundSize: "250%",
  backgroundRepeat: "no-repeat",
  animation: `${keyframes({
    from: { backgroundPosition: "150%" },
    to: { backgroundPosition: "-100%" },
  })} 1s infinite`,
});
