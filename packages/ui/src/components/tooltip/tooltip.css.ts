import { vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { blendAlpha } from "../../utils";

const backdropColor = blendAlpha(vars.colors.accents[1], 0.5);
const backdropFilter = "blur(10px)";

export const arrow = style({
  fill: backdropColor,
});

export const content = style({
  background: backdropColor,
  backdropFilter,
  padding: vars.spacing.sm,
  borderRadius: vars.roundness.sm,
  border: `1px solid ${vars.colors.outline.card}`,
  color: vars.colors.emphasis.high,
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  animationDuration: "400ms",
  willChange: "transform, opacity",
});

globalStyle(`${content}[data-state='delayed-open'][data-side='top']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateY(-2px)" },
  })}`,
});

globalStyle(`${content}[data-state='delayed-open'][data-side='bottom']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateY(2px)" },
  })}`,
});

globalStyle(`${content}[data-state='delayed-open'][data-side='left']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateX(-2px)" },
  })}`,
});

globalStyle(`${content}[data-state='delayed-open'][data-side='right']`, {
  animationName: `${keyframes({
    from: { opacity: 0, transform: "translateX(2px)" },
  })}`,
});
