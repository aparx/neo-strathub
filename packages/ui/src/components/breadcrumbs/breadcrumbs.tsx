import { mergeClassNames, Nullish } from "@repo/utils";
import { ComponentPropsWithoutRef, ReactElement } from "react";
import { Text } from "../text";
import * as css from "./breadcrumbs.css";

type BreadcrumbsBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

type BreadcrumbNode =
  | ReactElement
  | string
  | number
  | boolean
  | Nullish
  | BreadcrumbNode[];

export interface BreadcrumbsProps extends BreadcrumbsBaseProps {
  children: BreadcrumbNode;
}

export function Breadcrumbs({
  children,
  className,
  ...restProps
}: BreadcrumbsProps) {
  return (
    <Text
      asChild
      type={"label"}
      size={"lg"}
      className={mergeClassNames(className, css.list)}
      {...restProps}
    >
      <ol>
        {!Array.isArray(children) ? (
          <li className={css.breadcrumb({ active: true })}>{children}</li>
        ) : (
          children.filter(Boolean).map((breadcrumb, index) => (
            <li
              key={index /* OK */}
              className={css.breadcrumb({
                active: index === children.length - 1,
              })}
            >
              {breadcrumb}
            </li>
          ))
        )}
      </ol>
    </Text>
  );
}
