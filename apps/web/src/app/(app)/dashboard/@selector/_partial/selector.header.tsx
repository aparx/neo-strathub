"use client";

import { Button, Flexbox, Icon } from "@repo/ui/components";
import { useItemContext } from "../_context";

export function SelectorHeader() {
  const { filter } = useItemContext();

  return (
    <Flexbox gap={"md"}>
      <input
        type="text"
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
      />
      <Button appearance={"icon"}>
        <Icon.Add />
      </Button>
    </Flexbox>
  );
}
