import { sprinkles, vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const shell = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing["2xl"],
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 450,
});

export const shellTitle = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  margin: "0 auto",
});

export const modal = style([
  sprinkles({ outline: "card" }),
  {
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
    padding: vars.spacing.lg,
    background: vars.colors.accents[2],
    width: "fit-content",
    borderRadius: vars.roundness.sm,
    minWidth: "min(95dvw, 400px)", // TODO magic number
  },
]);

export const header = style({
  display: "flex",
  gap: vars.spacing.md,
  alignItems: "center",
});

export const formShell = style({
  color: vars.colors.emphasis.medium,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.lg,
});

export const footer = style({
  display: "flex",
  gap: vars.spacing.md,
  marginLeft: "auto",
});
