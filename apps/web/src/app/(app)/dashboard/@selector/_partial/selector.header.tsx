"use client";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { useItemContext } from "../_context";

export function SelectorHeader() {
  const { filter } = useItemContext();

  return (
    <Flexbox gap={"sm"} style={{ flexGrow: 1 }}>
      <TextField
        leading={<Icon.Mapped type={"search"} color={"red"} />}
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
        style={{ flexGrow: 1 }}
      />
      <Button appearance={"icon"}>
        <Icon.Mapped type={"add"} />
      </Button>
    </Flexbox>
  );
}
