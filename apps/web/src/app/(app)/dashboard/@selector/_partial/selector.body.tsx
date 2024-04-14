"use client";
import { Flexbox } from "@repo/ui/components";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ListItem } from "../_components";
import { ItemContext, useItemContext } from "../_context";

export function SelectorBody() {
  const { items, active } = useItemContext();
  const pathName = usePathname();

  useEffect(() => {
    const anyActive = items.find((item) => item && pathName === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathName]);

  return <ItemList items={items} active={active} />;
}

function ItemList({ items, active }: Pick<ItemContext, "items" | "active">) {
  const pathname = usePathname();
  return (
    <Flexbox asChild orient={"vertical"} gap={"sm"}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <ListItem
              {...item}
              active={active.state === item.href}
              loading={active.state === item.href && pathname !== item.href}
              onClick={() => active.update(item.href)}
            />
          </li>
        ))}
      </ul>
    </Flexbox>
  );
}
