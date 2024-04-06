import { vars } from "@repo/theme";

type StateColorKey = keyof typeof vars.colors.state;

export function blendColors(primary: string, secondary: string) {
  return `color-mix(in srgb, ${primary}, ${secondary})` as const;
}

export function blendState(primary: string, state: StateColorKey) {
  const { base, opacity } = vars.colors.state[state];
  return blendColors(primary, `${base} ${opacity}`);
}
