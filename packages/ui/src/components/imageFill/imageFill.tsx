import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";

type ImageFillBaseProps = Omit<ImageProps, "fill" | "width" | "height">;

export interface ImageFillProps extends ImageFillBaseProps {
  /** @default "cover" */
  fit?: CSSProperties["objectFit"];
  place?: CSSProperties["objectPosition"];
  size?: string | number;
  width?: string | number;
  height?: string | number;
}

export function ImageFill({
  fit = "cover",
  place,
  size,
  width = size,
  height = size,
  style,
  ...restProps
}: ImageFillProps) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <Image
        {...restProps}
        fill
        style={{
          objectFit: fit,
          objectPosition: place,
          ...style,
        }}
      />
    </div>
  );
}
