import { sprinkles, vars } from "@repo/theme";
import { blendState } from "@repo/ui/utils";
import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export const trigger = recipe({
  base: [
    sprinkles({ outline: "card" }),
    {
      position: "relative",
      padding: `${vars.spacing.sm} ${vars.spacing.md}`,
      display: "flex",
      alignItems: "center",
      gap: vars.spacing.md,
      borderRadius: vars.roundness.full,
      selectors: {
        "&:not([data-disabled])": {
          cursor: "pointer",
        },
      },
    },
  ],
  variants: {
    color: {
      destructive: {
        background: vars.colors.destructive.darkest,
        color: vars.colors.destructive.lighter,
        selectors: {
          "&:not([data-disabled]):hover": {
            background: blendState(vars.colors.destructive.darkest, "hover"),
          },
        },
      },
      primary: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
        selectors: {
          "&:not([data-disabled]):hover": {
            background: blendState(vars.colors.primary.darkest, "hover"),
          },
        },
      },
      warning: {
        background: vars.colors.warning.darkest,
        color: vars.colors.warning.lighter,
        selectors: {
          "&:not([data-disabled]):hover": {
            background: blendState(vars.colors.warning.darkest, "hover"),
          },
        },
      },
    },
  },
  defaultVariants: {
    color: "primary",
  },
});

export type RoleSelectVariants = RecipeVariants<typeof trigger>;

export const triggerExpand = style({
  position: "absolute",
  right: vars.spacing.sm,
  background: "inherit",
  lineHeight: 0.5,
});

export const itemIndicator = style({
  width: "1em",
  height: "1em",
  background: "currentColor",
  borderRadius: vars.roundness.full,
});

export const content = style([
  sprinkles({
    outline: "card",
  }),
  {
    overflow: "hidden",
    borderRadius: vars.roundness.md,
    boxShadow: `0 0 ${vars.spacing.md} ${vars.colors.accents[2]}`,
    animation: `${keyframes({
      from: { opacity: 0 },
    })} .15s`,
  },
]);

export const item = style({
  display: "flex",
  gap: vars.spacing.md,
  padding: vars.spacing.md,
  background: vars.colors.accents[5],
  cursor: "pointer",
});

globalStyle(`${item}[data-highlighted]`, {
  background: blendState(vars.colors.accents[5], "hover"),
});
