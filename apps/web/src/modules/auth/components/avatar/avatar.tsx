"use client";
import { Skeleton } from "@repo/ui/components";
import { mergeClassNames, Nullish } from "@repo/utils";
import Image from "next/image";
import { ComponentPropsWithoutRef, useState } from "react";
import * as css from "./avatar.css";

type AvatarBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface AvatarProps extends AvatarBaseProps {
  size?: string | number;
  alt?: string;
  src: Nullish<string>;
}

export function Avatar({
  size,
  src,
  alt = "User avatar",
  className,
  style,
  ...restProps
}: AvatarProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={mergeClassNames(className, css.avatar)}
      style={{ width: size, ...style }}
      {...restProps}
    >
      {!loaded && <Skeleton width={"100%"} height={"100%"} />}
      {src && (
        <Image
          className={css.image}
          src={src}
          alt={alt}
          fill
          onLoadingComplete={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
