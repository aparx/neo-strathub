import { sprinkles, vars } from "@repo/theme";
import { blendState, createLineHeight } from "@repo/ui/utils";
import { globalStyle, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";

const border = `1px solid ${vars.colors.outline.card}`;
const transition = "150ms";

const rootBase = style({
  display: "flex",
  contain: "paint",
  alignItems: "stretch",
});

export const root = style([
  sprinkles({ outline: "card", borderRadius: "md" }),
  rootBase,
  {
    transition,
    selectors: {
      "&:hover, &:focus-within": {
        background: vars.colors.state.hover.color,
      },
    },
  },
]);

export const headerContainer = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.lg,
  padding: vars.spacing.lg,
  background: vars.colors.accents[1],
  borderBottom: border,
  transition,
});

export const headerColumns = style({
  flexGrow: 1,
  display: "grid",
  gridTemplateColumns: "1.25fr 1fr",
  gap: vars.spacing.lg,
  maxWidth: 600, // TODO magic number
});

export const tagsContainer = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  width: "100%",
  padding: vars.spacing.md,
  contain: "paint",
  minHeight: calc.add(
    calc.multiply(2, vars.spacing.md),
    calc.multiply(2, vars.spacing.sm),
    createLineHeight(vars.fontSizes.label.sm),
  ),
  mask: `linear-gradient(to right, #000 ${calc.subtract("100%", vars.spacing.lg)}, #0000)`,
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
  transition,
  willChange: "background",
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

globalStyle(
  `${rootBase}:hover ${tagItem}, ${rootBase}:focus-within ${tagItem}`,
  {
    background: blendState(vars.colors.accents[1], "hover"),
    color: vars.colors.emphasis.medium,
  },
);

globalStyle(
  `${rootBase}:hover ${headerContainer}, ${rootBase}:focus-within ${headerContainer}`,
  {
    background: blendState(vars.colors.accents[1], "hover"),
  },
);
