import { vars } from "@repo/theme";
import { blendColors } from "@repo/ui/utils";
import { ComplexStyleRule, style } from "@vanilla-extract/css";
import { RecipeVariants, recipe } from "@vanilla-extract/recipes";

export type AvatarPresence = NonNullable<
  RecipeVariants<typeof avatar>
>["presence"];

export const AVATAR_PRESENCE_COLORS = {
  present: vars.colors.primary.lighter,
  online: "lightgreen",
  offline: blendColors("black", "white"),
} as const;

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
          background: AVATAR_PRESENCE_COLORS["present"],
        },
      },
      online: {
        "::after": {
          content: "",
          background: AVATAR_PRESENCE_COLORS["online"],
        },
      },
      offline: {
        "::after": {
          content: "",
          background: AVATAR_PRESENCE_COLORS["offline"],
        },
      },
    } satisfies Record<
      keyof typeof AVATAR_PRESENCE_COLORS | "none",
      ComplexStyleRule
    >,
  },
  defaultVariants: {
    presence: "none",
  },
});

export const image = style({
  objectFit: "fill",
  objectPosition: "center",
});
