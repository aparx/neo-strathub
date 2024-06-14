import { vars } from "@repo/theme";
import { blendColors } from "@repo/ui/utils";
import { style } from "@vanilla-extract/css";
import { recipe, RecipeVariants } from "@vanilla-extract/recipes";

export type AvatarPresence = NonNullable<
  RecipeVariants<typeof avatar>
>["presence"];

export const avatar = recipe({
  base: {
    position: "relative",
    borderRadius: "100%",
    aspectRatio: "1 / 1",
    "::before": {
      content: "",
      position: "absolute",
      inset: 0,
      borderRadius: "100%",
      background: vars.colors.emphasis.low,
      contain: "paint",
    },
    "::after": {
      position: "absolute",
      bottom: "-15%",
      right: "-15%",
      width: "30%",
      height: "30%",
      borderRadius: "100%",
      border: `2px solid ${vars.colors.accents[0]}`,
    },
  },
  variants: {
    presence: {
      none: {},
      /** Present in the current environment (such as the same document) */
      present: {
        "::after": {
          content: "",
          background: vars.colors.primary.lighter,
        },
      },
      online: {
        "::after": {
          content: "",
          background: "lightgreen",
        },
      },
      offline: {
        "::after": {
          content: "",
          background: blendColors("black", "white"),
        },
      },
    },
  },
  defaultVariants: {
    presence: "none",
  },
});

export const image = style({
  objectFit: "fill",
  objectPosition: "center",
});
