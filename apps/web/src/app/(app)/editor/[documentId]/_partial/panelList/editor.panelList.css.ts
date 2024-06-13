import { vars } from "@repo/theme";
import { keyframes } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export const SIDEPANEL_WIDTH = "280px";

export const panelList = recipe({
  base: {
    width: "100%",
    height: "100%",
    display: "flex",
    zIndex: 999,
    flexDirection: "column",
    overflowY: "auto",
    gap: vars.spacing.lg,
    padding: vars.spacing.md,
    paddingTop: 0,
    pointerEvents: "none",
    touchAction: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  variants: {
    side: {
      left: {
        gridArea: "lhs",
        animation: `${keyframes({
          from: {
            opacity: 0,
            transform: "translateX(-25%)",
          },
        })} .5s`,
      },
      right: {
        gridArea: "rhs",
        animation: `${keyframes({
          from: {
            opacity: 0,
            transform: "translateX(25%)",
          },
        })} .5s`,
      },
    },
  },
});

export type PanelListSide = NonNullable<
  RecipeVariants<typeof panelList>
>["side"];
