import type { DeepRecord } from "@repo/utils";

export type SpaceUnit = "3xl" | "2xl" | "xl" | "lg" | "md" | "sm" | "xs";

type Color = `rgba(${number}, ${number}, ${number}, ${number})`;
type Emphasis = "low" | "medium" | "high";

interface ColorTonePalette extends DeepRecord<Color> {
  base: Color;
  darker: Color;
  lighter: Color;
}

interface Colors extends DeepRecord<Color> {
  primary: ColorTonePalette;
  secondary: ColorTonePalette;
  foreground: Color;
  scrim: Color;
  overlay: Color;
  accents: Record<0 | 1 | 2 | 3, Color>;
  outline: Record<"card", Color>;
  warning: ColorTonePalette;
  destructive: ColorTonePalette;
  emphasis: Record<Emphasis, Color>;
}

export interface Theme extends DeepRecord<string> {
  colors: Colors;
  emphasis: Record<Emphasis, `${number}`>;
  spacing: Record<SpaceUnit, string>;
}
