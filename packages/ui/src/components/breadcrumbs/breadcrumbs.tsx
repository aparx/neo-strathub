import Link from "next/link";
import { AnchorHTMLAttributes, HTMLAttributes, useMemo } from "react";
import { Flexbox } from "../flexbox";
import { Text } from "../text";
import * as css from "./breadcrumbs.css";

export interface BreadcrumbData {
  forceRefetch?: boolean;
  display: React.ReactNode;
  href: string;
}

type BreadcrumbsBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface BreadcrumbsProps extends BreadcrumbsBaseProps {
  breadcrumbs: BreadcrumbData[];
}

export function Breadcrumbs({ breadcrumbs, ...restProps }: BreadcrumbsProps) {
  return (
    <Flexbox asChild gap={"md"}>
      <Text type={"label"} size={"lg"} {...restProps}>
        {useBreadcrumbComponents(breadcrumbs)}
      </Text>
    </Flexbox>
  );
}

function BreadcrumbDivider() {
  return <div className={css.divider}>/</div>;
}

function useBreadcrumbComponents(breadcrumbs: BreadcrumbsProps["breadcrumbs"]) {
  return useMemo(() => {
    const { length } = breadcrumbs;
    const arr = new Array<React.ReactNode>(Math.max(2 * length - 2, length));
    for (let i = 0; i < length; ++i) {
      const { href, display, forceRefetch } = breadcrumbs[i]!;
      const active = i === length - 1;
      if (i > 0) arr.push(<BreadcrumbDivider key={i} />);
      const props = {
        key: href,
        href: href,
        className: css.breadcrumb({ active }),
        children: display,
      } satisfies AnchorHTMLAttributes<HTMLAnchorElement>;
      arr.push(forceRefetch ? <a {...props} /> : <Link {...props} replace />);
    }
    return arr;
  }, [breadcrumbs]);
}
