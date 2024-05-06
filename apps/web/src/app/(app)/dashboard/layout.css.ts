import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { LAYOUT_HEADER_HEIGHT } from "./_partial/layout/layout.header.css";

/** The gap between different layout elements (headers, content, footer, etc.) */
export const DASHBOARD_GRID_GAP = "1px";

export const rootLayout = style({
  display: "flex",
  flexDirection: "column",
  height: `calc(100vh - ${DASHBOARD_GRID_GAP})`,
  background: vars.colors.outline.card,
  gap: DASHBOARD_GRID_GAP,
  maxWidth: 1500, // TODO magic number
  margin: "0 auto",
  content: "paint",

  // Disallow overflow in X and Y dimension
  overflow: "hidden",
});

export const gridLayout = style({
  display: "grid",
  gridTemplateColumns: "minmax(275px, 1fr) 2.5fr minmax(375px, 1.2fr)",
  width: "100%",
  height: `calc(100% - ${LAYOUT_HEADER_HEIGHT})`,
  gap: DASHBOARD_GRID_GAP,
});

export const pageFallback = style({
  width: "100%",
  height: "100%",
  background: vars.colors.accents[0],
  display: "grid",
  placeItems: "center",
});

export const sidebarContent = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.md,
});
