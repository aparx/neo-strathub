import type { DeepRecord, RGB, RGBA } from "@repo/utils";

export type SpaceUnit = "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";

type Emphasis = "low" | "medium" | "high";

interface StateColorPalette extends DeepRecord<string> {
  base: RGB;
  color: RGBA;
  /** Literal opacity in percentage */
  opacity: `${number}%`;
}

interface ColorTonePalette extends DeepRecord<RGBA> {
  base: RGBA;
  darker: RGBA;
  lighter: RGBA;
}

interface Colors extends DeepRecord<RGBA> {
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

export interface Theme extends DeepRecord<string> {
  colors: Colors;
  emphasis: Record<Emphasis, `${number}`>;
  spacing: Record<SpaceUnit, string>;
}
