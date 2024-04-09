"use client";

import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { useItemContext } from "../_context";

export function SelectorHeader() {
  const { filter } = useItemContext();

  return (
    <Flexbox gap={"sm"}>
      <TextField
        leading={<Icon.Mapped type={"search"} color={"red"} />}
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
      />
      <Button appearance={"icon"}>
        <Icon.Mapped type={"add"} />
      </Button>
    </Flexbox>
  );
}
