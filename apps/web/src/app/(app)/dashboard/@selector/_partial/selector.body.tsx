"use client";
import { Flexbox } from "@repo/ui/components";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ListItem } from "../_components";
import { useItemContext } from "../_context";

export function SelectorBody() {
  const { items } = useItemContext();
  const { active } = useItemContext();
  const pathName = usePathname();

  useEffect(() => {
    const anyActive = items.find((item) => pathName === item.href);
    if (anyActive) active.update(anyActive.href);
  }, [pathName]);

  return (
    <Flexbox asChild orient={"vertical"} gap={"sm"}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <ListItem
              {...item}
              active={active.state === item.href}
              loading={active.state === item.href && pathName !== item.href}
              onClick={() => active.update(item.href)}
            />
          </li>
        ))}
      </ul>
    </Flexbox>
  );
}
