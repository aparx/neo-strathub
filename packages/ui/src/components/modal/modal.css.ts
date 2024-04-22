import { sprinkles, vars } from "@repo/theme";
import { keyframes, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

export const content = style([
  sprinkles({
    outline: "card",
    borderRadius: "sm",
  }),
  {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
    padding: vars.spacing.lg,
    margin: vars.spacing.md,
    minWidth: `min(${calc.subtract("100dvw", calc.multiply(2, vars.spacing.md))}, 400px)`,
    background: vars.colors.accents[1],
    animation: `${keyframes({
      from: {
        opacity: 0,
        transform: "translate(-50%, -48%) scale(0.96)",
      },
    })} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
]);

export const scrim = style({
  position: "absolute",
  inset: 0,
  background: vars.colors.scrim,
  filter: "blur(10px)",
  animation: `${keyframes({
    from: { opacity: 0 },
  })} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
});

export const title = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: vars.spacing.md,
});

export const separator = style({
  width: "100%",
  height: 1,
  background: vars.colors.outline.card,
});