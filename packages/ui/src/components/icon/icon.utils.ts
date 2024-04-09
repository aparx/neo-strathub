import { vars } from "@repo/theme";

export const ICON_SIZES = {
  lg: vars.fontSizes.title.lg,
  md: vars.fontSizes.body.lg,
  sm: vars.fontSizes.body.md,
} as const satisfies Record<string, string>;
