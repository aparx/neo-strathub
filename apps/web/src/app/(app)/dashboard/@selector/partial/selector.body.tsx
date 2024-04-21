"use client";
import { isIntersectingURL } from "@/utils/generic";
import { useURL } from "@/utils/hooks";
import { Flexbox, Skeleton } from "@repo/ui/components";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ListItem, ListItemData } from "../components";
import { useItemContext } from "../context";
import * as css from "./selector.body.css";

export function SelectorBody() {
  const { items, active, fetching } = useItemContext();
  const absoluteURL = useURL();
  useEffect(() => {
    const anyActive = items.find(({ href }) =>
      isIntersectingURL(new URL(href, absoluteURL.origin), absoluteURL),
    );
    if (anyActive) active.update(anyActive.href);
  }, [items, absoluteURL]);

  const pathname = usePathname();

  useEffect(() => {
    const anyActive = items.find((item) => item && pathname === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathname]);

  return (
    <Flexbox asChild orient={"vertical"} gap={"sm"} className={css.slideIn}>
      <ul>
        {!fetching && items.map((data) => <Item key={data.href} {...data} />)}
        {fetching && <SkeletonList amount={3} />}
      </ul>
    </Flexbox>
  );
}

function SkeletonList({ amount: length }: { amount: number }) {
  return Array.from({ length }, (_, index) => (
    <li key={index}>
      <Skeleton height={47} roundness={"md"} outline />
    </li>
  ));
}

function Item({ href, ...restData }: ListItemData) {
  const { active } = useItemContext();
  const currentUrl = useURL();
  const isActive = active.state === href;
  let isLoading = false;
  if (isActive) {
    const expect = new URL(href, currentUrl.origin);
    isLoading = !isIntersectingURL(expect, currentUrl);
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
