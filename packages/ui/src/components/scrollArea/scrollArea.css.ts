import { vars } from "@repo/theme";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";

const SCROLLBAR_SIZE = vars.spacing.md;

export const root = style({
  overflow: "hidden",
});

export const viewport = style({
  width: "100%",
  height: "100%",
  borderRadius: "inherit",
});

export const scrollbar = style({
  display: "flex",
  userSelect: "none",
  touchAction: "none",
  paddingLeft: 2,
  paddingRight: 2,
});

export const thumb = style({
  flex: 1,
  background: vars.colors.emphasis.low,
  borderRadius: SCROLLBAR_SIZE,
  position: "relative",
  transition: "background .25s",
  ":hover": {
    background: vars.colors.emphasis.medium,
  },
  "::before": {
    //* increase hit size on mobile devices
    content: "",
    position: "absolute",
    bottom: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    height: "100%",
    minWidth: 20,
    minHeight: 20,
  },
});

globalStyle(`${scrollbar}[data-orientation='vertical']`, {
  width: SCROLLBAR_SIZE,
});

globalStyle(`${scrollbar}[data-orientation='vertical'][data-state='visible']`, {
  animation: `${keyframes({ from: { opacity: 0 } })} .15s`,
});

globalStyle(`${scrollbar}[data-orientation='horizontal']`, {
  flexDirection: "column",
  height: SCROLLBAR_SIZE,
});
