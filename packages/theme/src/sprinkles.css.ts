import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { BREAKPOINT_QUERIES } from "./breakpoint";
import { vars } from "./vars.css";

const responsiveProps = defineProperties({
  conditions: BREAKPOINT_QUERIES,
  defaultCondition: "mobile",
  properties: {
    display: ["none", "flex", "block", "inline", "grid"],
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
    borderRadius: vars.roundness,
    // padding
    paddingTop: vars.spacing,
    paddingBottom: vars.spacing,
    paddingLeft: vars.spacing,
    paddingRight: vars.spacing,
    // margin
    marginTop: vars.spacing,
    marginBottom: vars.spacing,
    marginLeft: vars.spacing,
    marginRight: vars.spacing,
    // gap
    gap: vars.spacing,
    columnGap: vars.spacing,
    rowGap: vars.spacing,
  },
  shorthands: {
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    padding: ["paddingLeft", "paddingTop", "paddingRight", "paddingBottom"],
  },
});

const extraProps = defineProperties({
  properties: {
    outline: {
      card: {
        border: `1px solid ${vars.colors.outline.card}`,
      },
    },
  },
});

export const sprinkles = createSprinkles(responsiveProps, extraProps);

export type Sprinkles = Parameters<typeof sprinkles>[0];
