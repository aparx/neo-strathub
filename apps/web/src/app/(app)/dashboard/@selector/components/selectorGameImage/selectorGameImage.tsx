import { Skeleton } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import Image from "next/image";
import { HTMLAttributes } from "react";

export interface SelectorGameImageProps extends HTMLAttributes<HTMLDivElement> {
  src: Nullish<string>;
  name: Nullish<string>;
  /** @default "1em" */
  size?: string | number;
}

export function SelectorGameImage({
  name,
  src,
  size = "1em",
  style,
  ...restProps
}: SelectorGameImageProps) {
  if (!src || !name) return <Skeleton width={size} height={size} />;
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        ...style,
      }}
      {...restProps}
    >
      <Image src={src} alt={name} fill style={{ objectFit: "cover" }} />
    </div>
  );
}
