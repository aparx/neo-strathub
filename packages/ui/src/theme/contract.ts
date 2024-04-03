import type { DeepContract } from "@repo/utils";

type Color = `rgba(${number}, ${number}, ${number}, ${number})`;
type Emphasis = "low" | "medium" | "high";

interface ColorTonePalette extends DeepContract<Color> {
  base: Color;
  darker: Color;
  lighter: Color;
}

interface ThemeColors extends DeepContract<Color> {
  primary: ColorTonePalette;
  secondary: ColorTonePalette;
  foreground: Color;
  scrim: Color;
  overlay: Color;
  accents: Record<0 | 1 | 2 | 3, Color>;
  warning: ColorTonePalette;
  destructive: ColorTonePalette;
  emphasis: Record<Emphasis, Color>;
}

export interface Theme extends DeepContract<string> {
  colors: ThemeColors;
  emphasis: Record<Emphasis, `${number}`>;
}
