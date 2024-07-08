import { FontSize, FontType, vars } from "@repo/theme";
import { DeepReadonly, Numberish } from "@repo/utils";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { createLetterSpace, createLineHeight } from "../../utils";

export type TextFont = keyof typeof FONTS;

export interface TextFontData {
  level?: number;
  size: string;
  font: TextFont;
  weight: Numberish;
  letterSpacing: Numberish;
  lineHeight: Numberish;
}

interface FontDataConstructor<T extends TextFontData> {
  (size: string, font: TextFont, weight?: number, level?: number): T;
  new (size: string, font: TextFont, weight?: number, level?: number): T;
}

export const FONTS = {
  sans: GeistSans,
  mono: GeistMono,
} as const;

const FontData = function (size, font, weight = 400, level) {
  const letterSpacing = createLetterSpace(size);
  const lineHeight = createLineHeight(size);
  return { size, font, weight, letterSpacing, lineHeight, level } as const;
} as FontDataConstructor<DeepReadonly<TextFontData>>;

export const FONT_DATA_MAP: DeepReadonly<
  Record<FontType, Record<FontSize, TextFontData>>
> = {
  display: {
    lg: new FontData(vars.fontSizes.display.lg, "sans", 700, 1),
    md: new FontData(vars.fontSizes.display.md, "sans", 700, 2),
    sm: new FontData(vars.fontSizes.display.sm, "sans", 700, 3),
  },
  title: {
    lg: new FontData(vars.fontSizes.title.lg, "sans", 600, 4),
    md: new FontData(vars.fontSizes.title.md, "sans", 600, 5),
    sm: new FontData(vars.fontSizes.title.sm, "sans", 600, 6),
  },
  body: {
    lg: new FontData(vars.fontSizes.body.lg, "sans", 400),
    md: new FontData(vars.fontSizes.body.md, "sans", 400),
    sm: new FontData(vars.fontSizes.body.sm, "sans", 400),
  },
  label: {
    lg: new FontData(vars.fontSizes.label.lg, "sans", 500),
    md: new FontData(vars.fontSizes.label.md, "sans", 500),
    sm: new FontData(vars.fontSizes.label.sm, "sans", 500),
  },
} as const;
