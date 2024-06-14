import { vars } from "@repo/theme";
import { CSSProperties } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { AvatarPresence } from "../avatar";

export const field = recipe({
  base: {
    display: "flex",
    alignItems: "center",
    gap: vars.spacing.md,
  },
  variants: {
    presence: {
      none: {},
      offline: {
        color: vars.colors.emphasis.medium,
      },
      online: {
        color: vars.colors.emphasis.high,
      },
    } satisfies Record<AvatarPresence & {}, CSSProperties>,
  },
  defaultVariants: {
    presence: "none",
  },
});
