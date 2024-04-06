import { Slot } from "@radix-ui/react-slot";
import { FontSize, FontType } from "@repo/theme";
import { mergeClassNames } from "@repo/utils";
import { HTMLProps, forwardRef, useCallback, useMemo } from "react";
import { FONT_DATA_MAP, TextFontData } from "./text.font";

interface TypographyProps {
  data?: Partial<TextFontData>;
  /** @default "body" */
  type?: FontType;
  /** @default "md" */
  size?: FontSize;
}

type TextBaseProps = TypographyProps &
  Omit<HTMLProps<HTMLDivElement>, keyof TypographyProps>;

export interface TextProps extends TextBaseProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export const Text = forwardRef<HTMLDivElement, TextProps>(
  function Text(props, ref) {
    const {
      asChild,
      type = "body",
      size = "md",
      className,
      data,
      style = {},
      ...restProps
    } = props;

    // Most often `data` is not used, which is why memoization can provide a benefit
    // prettier-ignore
    const fontData = useMemo(() => ({
      ...FONT_DATA_MAP[type][size],
      ...data
    }), [type, size, data]);

    const defineComponent = useCallback(() => {
      if (!fontData.level) return "div";
      if (fontData.level >= 0 && fontData.level <= 6)
        return `h${fontData.level}`;
      return "div";
    }, [fontData.level]);

    const Component = asChild ? Slot : defineComponent();
    return (
      <Component
        ref={ref}
        className={mergeClassNames(className, fontData.font.className)}
        role={(fontData.level ?? 0) > 6 ? "heading" : undefined}
        aria-level={fontData.level}
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
  },
);
