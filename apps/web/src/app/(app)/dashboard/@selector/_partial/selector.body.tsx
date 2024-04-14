"use client";
import { Flexbox } from "@repo/ui/components";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ListItem } from "../_components";
import { useItemContext } from "../_context";

export function SelectorBody() {
  const { items, active } = useItemContext();
  const pathname = usePathname();

  useEffect(() => {
    const anyActive = items.find((item) => item && pathname === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathname]);

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
