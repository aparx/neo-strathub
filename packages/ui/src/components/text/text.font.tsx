import { FontSize, FontType, vars } from "@repo/theme";
import { DeepReadonly } from "@repo/utils";
import { GeistSans } from "geist/font/sans";
import type { NextFont } from "next/dist/compiled/@next/font";
import { createLetterSpace, createLineHeight } from "../../utils";

export interface TextFontData {
  level?: number;
  size: string;
  font: NextFont;
  weight: number;
  letterSpacing: string;
  lineHeight: string;
}

// @formatter:off
interface FontDataConstructor<T extends TextFontData> {
  (size: string, font: NextFont, weight?: number, level?: number): T;
  new (size: string, font: NextFont, weight?: number, level?: number): T;
}
// @formatter:on

const FontData = function (size, font, weight = 400, level) {
  const letterSpacing = createLetterSpace(size);
  const lineHeight = createLineHeight(size);
  return { size, font, weight, letterSpacing, lineHeight, level } as const;
} as FontDataConstructor<DeepReadonly<TextFontData>>;

export const FONT_DATA_MAP: DeepReadonly<
  Record<FontType, Record<FontSize, TextFontData>>
> = {
  display: {
    lg: new FontData(vars.fontSizes.display.lg, GeistSans, 700, 1),
    md: new FontData(vars.fontSizes.display.md, GeistSans, 700, 2),
    sm: new FontData(vars.fontSizes.display.sm, GeistSans, 700, 3),
  },
  title: {
    lg: new FontData(vars.fontSizes.title.lg, GeistSans, 600, 4),
    md: new FontData(vars.fontSizes.title.md, GeistSans, 600, 5),
    sm: new FontData(vars.fontSizes.title.sm, GeistSans, 600, 6),
  },
  body: {
    lg: new FontData(vars.fontSizes.body.lg, GeistSans, 400),
    md: new FontData(vars.fontSizes.body.md, GeistSans, 400),
    sm: new FontData(vars.fontSizes.body.sm, GeistSans, 400),
  },
  label: {
    lg: new FontData(vars.fontSizes.label.lg, GeistSans, 700),
    md: new FontData(vars.fontSizes.label.md, GeistSans, 700),
    sm: new FontData(vars.fontSizes.label.sm, GeistSans, 700),
  },
} as const;
