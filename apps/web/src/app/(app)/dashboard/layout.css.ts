import { vars } from "@repo/theme";
import { style } from "@vanilla-extract/css";
import { LAYOUT_HEADER_HEIGHT } from "./_partial/layout.header.css";

/** The gap between different layout elements (headers, content, footer, etc.) */
export const DASHBOARD_GRID_GAP = "1px";

export const rootLayout = style({
  display: "flex",
  flexDirection: "column",
  height: `calc(100vh - ${DASHBOARD_GRID_GAP})`,
  background: vars.colors.outline.card,
  gap: DASHBOARD_GRID_GAP,
});

export const gridLayout = style({
  display: "grid",
  gridTemplateColumns: "minmax(275px, 1fr) 3fr minmax(375px, 1.2fr)",
  width: "100%",
  height: `calc(100% - ${LAYOUT_HEADER_HEIGHT})`,
  gap: DASHBOARD_GRID_GAP,
});
