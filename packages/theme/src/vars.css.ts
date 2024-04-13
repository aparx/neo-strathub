import { createGlobalTheme } from "@vanilla-extract/css";
import type { Theme } from "./contract";

export const vars = createGlobalTheme<Theme>(":root", {
  emphasis: {
    low: "0.38",
    medium: "0.7",
    high: "1",
  },
  colors: {
    primary: {
      base: "rgba(107, 185, 242, 1)",
      darker: "rgba(10, 85, 142, 1)",
      lighter: "rgba(107, 185, 242, 1)",
      darkest: "rgba(21, 37, 48, 1)",
    },
    secondary: {
      base: "rgba(144, 106, 226, 1)",
      darker: "rgba(100, 72, 161, 1)",
      lighter: "rgba(177, 149, 237, 1)",
      darkest: "rgba(43, 28, 74, 1)",
    },
    foreground: "rgba(245, 245, 245, 1)",
    scrim: "rgba(0, 0, 0, 0.7)",
    overlay: "rgba(245, 245, 245, 0.05)",
    warning: {
      base: "rgba(211, 164, 45, 1)",
      darker: "rgba(255, 187, 12, 1)",
      lighter: "rgba(255, 241, 190, 1)",
      darkest: "rgba(51, 37, 2, 1)",
    },
    destructive: {
      base: "rgba(224, 76, 85, 1)",
      darker: "rgba(122, 51, 55, 1)",
      lighter: "rgba(0, 0, 0, 0)",
      darkest: "rgba(45, 15, 17, 1)",
    },
    emphasis: {
      low: "rgba(245, 245, 245, .38)",
      medium: "rgba(245, 245, 245, .7)",
      high: "rgba(245, 245, 245, 1)",
    },
    accents: {
      0: "rgba(0, 0, 0, 1)",
      1: "rgba(8, 8, 8, 1)",
      2: "rgba(13, 13, 13, 1)",
      3: "rgba(17, 17, 17, 1)",
    },
    outline: {
      card: "rgba(255, 255, 255, 0.15)",
    },
    state: {
      hover: {
        base: "rgb(245, 245, 245)",
        color: "rgba(245, 245, 245, .07)",
        opacity: "7%",
      },
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
  roundness: {
    xs: "2px",
    sm: "5px",
    md: "10px",
    lg: "15px",
    xl: "20px",
    "2xl": "30px",
    "3xl": "40px",
    full: "9999px",
    none: "0px",
  },
  fontSizes: {
    display: {
      lg: "2.86rem",
      md: "2.14rem",
      sm: "1.43rem",
    },
    title: {
      lg: "1.29rem",
      md: "1.14rem",
      sm: "1rem",
    },
    body: {
      lg: "1.14rem",
      md: "1rem",
      sm: "0.86rem",
    },
    label: {
      lg: "1rem",
      md: "0.86rem",
      sm: "0.79rem",
    },
  },
});
