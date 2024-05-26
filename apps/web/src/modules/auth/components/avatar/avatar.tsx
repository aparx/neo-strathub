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

  /**
   * If true optimizes the avatar image using NextJS' static image optimization.
   * By default, this value is false, since avatars are usually links to foreign
   * storage sites, that provide the images. So in order to reduce overall site costs,
   * leaving this unoptimized might be the best choice for as long as avatars are not
   * self-hosted.
   */
  optimized?: boolean;
}

export function Avatar({
  size,
  src,
  alt = "User avatar",
  optimized,
  className,
  style,
  ...restProps
}: AvatarProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={mergeClassNames(className, css.avatar)}
      style={{ width: size, height: size, ...style }}
      {...restProps}
    >
      {!loaded && <Skeleton width={"100%"} height={"100%"} />}
      {src && (
        <Image
          unoptimized={!optimized}
          className={css.image}
          src={src}
          alt={alt}
          fill
          style={{ opacity: loaded ? 1 : 0 }}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
}
