import { DeepReadonly } from "@repo/utils";
import { calc } from "@vanilla-extract/css-utils";
import { GeistSans } from "geist/font/sans";
import type { NextFont } from "next/dist/compiled/@next/font";
import { FontSize, FontType } from "./contract";
import { vars } from "./vars.css";

export interface FontData {
  size: string;
  font: NextFont;
  weight: number;
  letterSpacing: string;
  lineHeight: string;
}

// @formatter:off
interface FontDataConstructor {
  (size: string, font: NextFont, weight?: number): DeepReadonly<FontData>;
  new (size: string, font: NextFont, weight?: number): DeepReadonly<FontData>;
}
// @formatter:on

const FontData = function (size, font, weight = 400) {
  const letterSpacing = createLetterSpace(size);
  const lineHeight = createLineHeight(size);
  return { size, font, weight, letterSpacing, lineHeight } as const;
} as FontDataConstructor;

export const createLetterSpace = (size: string) => calc.multiply(size, 0.03);
export const createLineHeight = (size: string) => calc.multiply(size, 1.2);

export const FONT_DATA_MAP: DeepReadonly<
  Record<FontType, Record<FontSize, FontData>>
> = {
  display: {
    lg: new FontData(vars.fontSizes.display.lg, GeistSans, 400),
    md: new FontData(vars.fontSizes.display.md, GeistSans, 400),
    sm: new FontData(vars.fontSizes.display.sm, GeistSans, 400),
  },
  title: {
    lg: new FontData(vars.fontSizes.title.lg, GeistSans, 400),
    md: new FontData(vars.fontSizes.title.md, GeistSans, 400),
    sm: new FontData(vars.fontSizes.title.sm, GeistSans, 400),
  },
  body: {
    lg: new FontData(vars.fontSizes.body.lg, GeistSans, 400),
    md: new FontData(vars.fontSizes.body.md, GeistSans, 400),
    sm: new FontData(vars.fontSizes.body.sm, GeistSans, 400),
  },
  label: {
    lg: new FontData(vars.fontSizes.label.lg, GeistSans, 400),
    md: new FontData(vars.fontSizes.label.md, GeistSans, 400),
    sm: new FontData(vars.fontSizes.label.sm, GeistSans, 400),
  },
} as const;
