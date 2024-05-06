import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";

export const container = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
    padding: vars.spacing.lg,
    background: vars.colors.accents[1],
    borderRadius: vars.roundness.sm,
    animation: `${keyframes({
      from: { opacity: 0, transform: "translateX(2%)" },
    })} .5s`,
  },
]);
