import { Enums } from "@/utils/supabase/types";
import { vars } from "@repo/theme";
import { CSSProperties } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

type RequiredVariants = Record<Enums<"audit_log_type">, CSSProperties>;

export const container = recipe({
  base: {
    textAlign: "center",
    width: 70,
    padding: `${vars.spacing.sm} ${vars.spacing.md}`,
    borderRadius: vars.roundness.full,
  },
  variants: {
    type: {
      create: {
        background: vars.colors.primary.darkest,
        color: vars.colors.primary.lighter,
      },
      update: {
        background: vars.colors.warning.darkest,
        color: vars.colors.warning.lighter,
      },
      delete: {
        background: vars.colors.destructive.darkest,
        color: vars.colors.destructive.lighter,
      },
      info: {
        background: vars.colors.accents[3],
        color: vars.colors.emphasis.medium,
      },
    } satisfies RequiredVariants,
  },
  defaultVariants: {
    type: "info",
  },
});
