"use client";
import { isPartOfURL } from "@/utils/generic";
import { useURL } from "@/utils/hooks";
import { Flexbox, Skeleton } from "@repo/ui/components";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ListItem, ListItemData } from "../components";
import { useItemContext } from "../context";
import * as css from "./selector.body.css";

export function SelectorBody() {
  const { items, active, fetching } = useItemContext();
  const absoluteURL = useURL();
  useEffect(() => {
    const anyActive = items.find(({ href }) => {
      return isPartOfURL(new URL(href, absoluteURL.origin), absoluteURL);
    });
    if (anyActive) active.update(anyActive.href);
  }, [items, absoluteURL]);

  const pathname = usePathname();

  useEffect(() => {
    const anyActive = items.find((item) => item && pathname === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathname]);

  const skeletons = useMemo(() => {
    if (!fetching) return null;
    const arr: React.ReactNode[] = [];
    for (let i = 0; i < 3; ++i)
      arr.push(
        <li key={i}>
          <ListItemSkeleton />
        </li>,
      );
    return arr;
  }, [fetching]);

  return (
    <Flexbox
      asChild
      orient={"vertical"}
      gap={"sm"}
      className={css.slideInFromRight}
    >
      <ul>
        {!fetching && items.map((data) => <Item key={data.href} {...data} />)}
        {skeletons}
      </ul>
    </Flexbox>
  );
}

function ListItemSkeleton() {
  return <Skeleton height={47} roundness={"md"} outline />;
}

function Item({ href, ...restData }: ListItemData) {
  const { active } = useItemContext();
  const currentUrl = useURL();
  const isActive = active.state === href;
  let isLoading = false;
  if (isActive) {
    const expect = new URL(href, currentUrl.origin);
    isLoading = !isPartOfURL(expect, currentUrl);
  }
  return (
    <li key={href}>
      <ListItem
        href={href}
        active={isActive}
        loading={isLoading}
        onRedirect={() => active.update(href)}
        {...restData}
      />
    </li>
  );
}
