import Link from "next/link";
import { HTMLAttributes, useMemo } from "react";
import { Flexbox } from "../flexbox";
import { Text } from "../text";
import * as css from "./breadcrumbs.css";

export interface BreadcrumbData {
  href?: string;
  forceRefetch?: boolean;
  display: React.ReactNode;
}

type BreadcrumbsBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface BreadcrumbsProps extends BreadcrumbsBaseProps {
  breadcrumbs: BreadcrumbData[];
}

export function Breadcrumbs({ breadcrumbs, ...restProps }: BreadcrumbsProps) {
  return (
    <Flexbox asChild>
      <Text asChild type={"label"} size={"lg"} {...restProps}>
        <ol>
          {useMemo(
            () =>
              breadcrumbs.map(({ href, display, forceRefetch }, index) => {
                // Determine what component to represent this breadcrumb
                let child: React.ReactNode;
                if (!href || index === breadcrumbs.length - 1)
                  child = <div>{display}</div>;
                else if (forceRefetch) child = <a href={href}>{display}</a>;
                else child = <Link href={href}>{display}</Link>;

                return (
                  <li
                    key={index /* OK */}
                    className={css.breadcrumb({
                      active: index === breadcrumbs.length - 1,
                    })}
                  >
                    {child}
                  </li>
                );
              }),
            [breadcrumbs],
          )}
        </ol>
      </Text>
    </Flexbox>
  );
}
