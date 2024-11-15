import { calc } from "@vanilla-extract/css-utils";

export const createLetterSpace = (size: string) => calc.multiply(size, 0.02);
export const createLineHeight = (size: string) => calc.multiply(size, 1.2);
