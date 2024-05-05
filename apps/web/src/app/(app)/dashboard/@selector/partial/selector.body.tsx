"use client";
import { isIncludingURL } from "@/utils/generic";
import { useURL } from "@/utils/hooks";
import { Flexbox, Skeleton } from "@repo/ui/components";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SelectorListItem, SelectorListItemData } from "../components";
import { useItemContext } from "../context";
import * as css from "./selector.body.css";

export function SelectorBody() {
  const { items, active, loading } = useItemContext();
  const absoluteURL = useURL();
  useEffect(() => {
    const anyActive = items.find(({ href }) =>
      isIncludingURL(new URL(href, absoluteURL.origin), absoluteURL),
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
        {!loading && items.map((data) => <Item key={data.href} {...data} />)}
        {loading && <SkeletonList amount={3} />}
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

function Item({ href, ...restData }: SelectorListItemData) {
  const { active } = useItemContext();
  const currentUrl = useURL();
  const isActive = active.state === href;
  const finalUrl = new URL(href, currentUrl.origin);

  // Apply all the additional currently unset searchParams
  useSearchParams().forEach((val, key) => {
    if (!finalUrl.searchParams.has(key)) {
      finalUrl.searchParams.set(key, val);
    }
  });

  return (
    <li key={href}>
      <SelectorListItem
        href={`${finalUrl.pathname}?${finalUrl.searchParams}`}
        active={isActive}
        loading={isActive && !isIncludingURL(finalUrl, currentUrl)}
        onRedirect={() => active.update(href)}
        {...restData}
      />
    </li>
  );
}
