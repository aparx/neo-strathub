import { sprinkles, vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const border = `1px solid ${vars.colors.outline.card}`;

export const article = style([
  sprinkles({ outline: "card", borderRadius: "md" }),
  {
    display: "flex",
    overflow: "hidden",
    alignItems: "stretch",
  },
]);

export const headerContainer = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.lg,
  padding: vars.spacing.lg,
  background: vars.colors.accents[1],
  borderBottom: border,
});

export const headerColumns = style({
  width: "100%",
  columns: 2,
  gap: vars.spacing.lg,
  maxWidth: 750, // TODO magic number
});

export const tagsContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: vars.spacing.md,
  overflow: "hidden",
  minHeight: calc.add(
    calc.multiply(2, vars.spacing.md),
    calc.multiply(2, vars.spacing.sm),
    createLineHeight(vars.fontSizes.label.sm),
  ),
  "::after": {
    content: "",
    position: "absolute",
    inset: 0,
    left: calc.subtract("100%", vars.spacing.lg),
    background: `linear-gradient(to right, transparent, ${vars.colors.accents[0]})`,
  },
});

export const tagList = style({
  display: "flex",
  gap: vars.spacing.md,
  position: "absolute",
  // For future reference: remove absolute position & allow flexWrap for an "expanded"
  // overview of tags. Potentially refactor this style into a recipe.
});

export const tagItem = style({
  whiteSpace: "nowrap",
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  background: vars.colors.accents[1],
  color: vars.colors.emphasis.low,
  borderRadius: vars.roundness.sm,
});

/** Semantic footer (being the extra buttons for desktop only) */
export const footer = style({
  borderLeft: border,
  flexBasis: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: vars.spacing.md,
  padding: `0 ${vars.spacing.md}`,
});
