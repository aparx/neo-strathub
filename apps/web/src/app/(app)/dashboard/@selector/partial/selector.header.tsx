"use client";
import { OpenModalLink } from "@/modules/modal/components";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useItemContext } from "../context";

export function SelectorHeader() {
  const { filter } = useItemContext();
  const params = useParams<{ teamId?: string }>();

  return (
    <Flexbox gap={"sm"} style={{ width: "100%" }}>
      <TextField
        leading={<Icon.Mapped type={"search"} color={"red"} />}
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
        style={{ flexGrow: 1, width: "100%" }}
      />
      <Button asChild appearance={"icon"}>
        <OpenModalLink modal={params.teamId ? "createBook" : "createTeam"}>
          <Icon.Mapped type={"add"} />
        </OpenModalLink>
      </Button>
    </Flexbox>
  );
}
