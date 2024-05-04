import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { Text } from "../text";
import * as css from "./breadcrumbs.css";

type BreadcrumbsBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface BreadcrumbsProps extends BreadcrumbsBaseProps {
  crumbs: React.ReactNode[];
}

export function Breadcrumbs({
  crumbs,
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
        {crumbs.map((breadcrumb, index) => (
          <li
            key={index /* OK */}
            className={css.breadcrumb({
              active: index === crumbs.length - 1,
            })}
          >
            {breadcrumb}
          </li>
        ))}
      </ol>
    </Text>
  );
}
