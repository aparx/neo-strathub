import Image, { ImageProps } from "next/image";
import { CSSProperties } from "react";

type CoverImageBaseProps = Omit<ImageProps, "fill" | "width" | "height">;

export interface CoverImageProps extends CoverImageBaseProps {
  /** @default "cover" */
  fit?: CSSProperties["objectFit"];
  place?: CSSProperties["objectPosition"];
  size?: string | number;
  width?: string | number;
  height?: string | number;
}

export function CoverImage({
  fit = "cover",
  place,
  size,
  width = size,
  height = size,
  style,
  ...restProps
}: CoverImageProps) {
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
