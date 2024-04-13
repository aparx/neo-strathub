import type { DeepRecord, RGB, RGBA } from "@repo/utils";

interface ColorTonePalette extends DeepRecord<RGBA> {
  base: RGBA;
  darker: RGBA;
  darkest: RGBA;
  lighter: RGBA;
}

interface StateColorPalette extends DeepRecord<string> {
  base: RGB;
  color: RGBA;
  /** Literal opacity in percentage */
  opacity: `${number}%`;
}

type Emphasis = "low" | "medium" | "high";

interface Colors extends DeepRecord<string> {
  primary: ColorTonePalette;
  secondary: ColorTonePalette;
  foreground: RGBA;
  scrim: RGBA;
  overlay: RGBA;
  accents: Record<0 | 1 | 2 | 3, RGBA>;
  outline: Record<"card", RGBA>;
  warning: ColorTonePalette;
  destructive: ColorTonePalette;
  emphasis: Record<Emphasis, RGBA>;
  state: Record<"hover", StateColorPalette>;
}

export type SpaceUnit = "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";

export type FontType = "display" | "title" | "body" | "label";
export type FontSize = "lg" | "md" | "sm";

export interface Theme extends DeepRecord<string> {
  colors: Colors;
  emphasis: Record<Emphasis, `${number}`>;
  spacing: Record<SpaceUnit, string>;
  roundness: Record<SpaceUnit | "full" | "none", string>;
  fontSizes: Record<FontType, Record<FontSize, `${number}rem`>>;
}
