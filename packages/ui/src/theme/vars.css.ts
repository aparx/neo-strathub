import { createTheme } from "@vanilla-extract/css";
import type { Theme } from "@/theme/contract";

export const [themeClass, vars] = createTheme<Theme>({
  emphasis: {
    low: "0.38",
    medium: "0.7",
    high: "1",
  },
  colors: {
    primary: {
      base: "rgba(0, 0, 0, 0)",
      darker: "rgba(0, 0, 0, 0)",
      lighter: "rgba(0, 0, 0, 0)",
    },
    secondary: {
      base: "rgba(0, 0, 0, 0)",
      darker: "rgba(0, 0, 0, 0)",
      lighter: "rgba(0, 0, 0, 0)",
    },
    foreground: "rgba(0, 0, 0, 0)",
    scrim: "rgba(0, 0, 0, 0)",
    overlay: "rgba(0, 0, 0, 0)",
    warning: {
      base: "rgba(0, 0, 0, 0)",
      darker: "rgba(0, 0, 0, 0)",
      lighter: "rgba(0, 0, 0, 0)",
    },
    destructive: {
      base: "rgba(0, 0, 0, 0)",
      darker: "rgba(0, 0, 0, 0)",
      lighter: "rgba(0, 0, 0, 0)",
    },
    emphasis: {
      low: `rgba(0, 0, 0, 0)`,
      medium: `rgba(0, 0, 0, 0)`,
      high: `rgba(0, 0, 0, 0)`,
    },
    accents: {
      0: "rgba(0, 0, 0, 0)",
      1: "rgba(0, 0, 0, 0)",
      2: "rgba(0, 0, 0, 0)",
      3: "rgba(0, 0, 0, 0)",
    },
    outline: {
      card: "rgba(0, 0, 0, 0)",
    },
  },
  spacing: {
    xs: "2px",
    sm: "5px",
    md: "10px",
    lg: "15px",
    xl: "20px",
    "2xl": "30px",
    "3xl": "40px",
  },
});
