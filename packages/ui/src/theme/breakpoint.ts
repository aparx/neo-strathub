export type Breakpoint = keyof typeof BREAKPOINTS;

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

export const BREAKPOINT_QUERIES = {
  mobile: { "@media": `only screen (max-width: ${BREAKPOINTS.tablet - 1}px)` },
  tablet: { "@media": `only screen (min-width: ${BREAKPOINTS.tablet}px)` },
  desktop: { "@media": `only screen (min-width: ${BREAKPOINTS.desktop}px)` },
} as const;

export function getBreakpointMediaQuery(breakpoint: Breakpoint) {
  return BREAKPOINT_QUERIES[breakpoint]["@media"];
}
