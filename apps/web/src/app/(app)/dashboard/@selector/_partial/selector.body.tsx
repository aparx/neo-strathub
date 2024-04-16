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
        {items.map(({ href, ...restData }) => (
          <li key={href}>
            <ListItem
              href={href}
              active={active.state === href}
              loading={active.state === href && pathname !== href}
              onClick={(e) => !e.isDefaultPrevented() && active.update(href)}
              {...restData}
            />
          </li>
        ))}
      </ul>
    </Flexbox>
  );
}
