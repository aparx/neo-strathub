import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});

export const noneFound = style({
  position: "absolute",
  left: "50%",
  bottom: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
  alignItems: "center",
});
