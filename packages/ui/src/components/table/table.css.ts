import { vars } from "@repo/theme";
import { globalStyle, style } from "@vanilla-extract/css";
import { createLineHeight } from "../../utils";

const border = `1px solid ${vars.colors.accents[1]}`;

export const root = style({
  overflow: "auto",
  borderRadius: vars.spacing.sm,
  borderCollapse: "collapse",
  border: `1px solid ${vars.colors.outline.card}`,
  "::-webkit-scrollbar": {
    background: vars.colors.overlay,
    width: vars.spacing.sm,
  },
  "::-webkit-scrollbar-thumb": {
    background: vars.colors.emphasis.low,
    borderRadius: 9999,
  },
});

export const table = style({
  border: "none",
  width: "100%",
});

export const head = style({
  background: vars.colors.accents[3],
  color: vars.colors.emphasis.medium,
  fontWeight: 500,
  borderBottom: border,
  position: "sticky",
  top: 0,
  zIndex: 1,
});

export const body = style({
  background: vars.colors.accents[2],
  color: vars.colors.emphasis.medium,
  maxHeight: 30,
  overflow: "auto",
});

export const cell = style({
  position: "relative",
  padding: vars.spacing.md,
  textAlign: "left",
  verticalAlign: "middle",
});

export const row = style({
  position: "relative",
});

globalStyle(`${body} ${row}:hover`, {
  background: vars.colors.state.hover.color,
});

globalStyle(`${row} + tr`, {
  borderTop: border,
});

globalStyle(`${head} ${cell} + ${cell}::before`, {
  content: "",
  position: "absolute",
  width: 1,
  left: 0,
  top: "50%",
  transform: "translateY(-50%)",
  height: createLineHeight("1em"),
  background: vars.colors.outline.card,
});
