import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { BREAKPOINT_QUERIES } from "./breakpoint";
import { vars } from "./vars.css";

const responsiveProps = defineProperties({
  conditions: BREAKPOINT_QUERIES,
  defaultCondition: "mobile",
  properties: {
    display: [
      "flex",
      "block",
      "table",
      "grid",
      "inline",
      "inline-block",
      "inline-flex",
      "inline-grid",
      "inline-table",
    ],
    justifyContent: [
      "stretch",
      "flex-start",
      "center",
      "flex-end",
      "space-between",
    ],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    flexWrap: ["wrap", "nowrap"],
    flexDirection: ["column", "row", "row-reverse", "column-reverse"],
    gap: vars.spacing,
  },
});

export const sprinkles = createSprinkles(responsiveProps);

export type Sprinkles = Parameters<typeof sprinkles>[0];
