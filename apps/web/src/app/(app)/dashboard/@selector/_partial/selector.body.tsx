"use client";
import { Flexbox } from "@repo/ui/components";
import { ListItem } from "../_components";
import { useItemContext } from "../_context";

export function SelectorBody() {
  const { items } = useItemContext();


  return (
    <Flexbox asChild orient={"vertical"} gap={"sm"}>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <ListItem {...item} />
          </li>
        ))}
      </ul>
    </Flexbox>
  );
}
