import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { BREAKPOINT_QUERIES } from "./breakpoint";

const responsiveProps = defineProperties({
  conditions: BREAKPOINT_QUERIES,
  defaultCondition: "mobile",
  properties: {
    justifyContent: [
      "stretch",
      "flex-start",
      "center",
      "flex-end",
      "space-between",
    ],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    flexWrap: ["wrap", "nowrap"],
  },
});

export const sprinkles = createSprinkles(responsiveProps);
