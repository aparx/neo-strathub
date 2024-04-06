import { Slot } from "@radix-ui/react-slot";
import { FontSize, FontType } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { HTMLProps, useMemo } from "react";
import { FONT_DATA_MAP, FontData } from "./fontData";

type TextBaseProps = Omit<HTMLProps<HTMLDivElement>, "type" | "data" | "size">;

export interface TextProps extends TextBaseProps {
  children: React.ReactNode;

  /** @default "body" */
  type?: FontType;
  /** @default "md" */
  size?: FontSize;
  data?: Partial<FontData>;
  asChild?: boolean;
}

export function Text({
  asChild,
  type = "body",
  size = "md",
  className,
  data,
  style = {},
  ...restProps
}: TextProps) {
  // Most often `data` is not used, which is why memoization can provide a benefit
  // prettier-ignore
  const fontData = useMemo(() => ({
    ...FONT_DATA_MAP[type][size],
    ...data,
  }), [type, size, data]);

  const Component = asChild ? Slot : "div";
  return (
    <Component
      className={mergeClassNames(className, fontData.font.className)}
      style={{
        fontSize: fontData.size,
        fontWeight: fontData.weight,
        letterSpacing: fontData.letterSpacing,
        lineHeight: fontData.lineHeight,
        ...style,
      }}
      {...restProps}
    />
  );
}
