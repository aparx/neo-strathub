"use client";

import { Flexbox } from "@repo/ui/components";
import { useMemo } from "react";
import { MdPeople } from "react-icons/md";
import { ItemContext, ItemContextProvider } from "./_context";
import { SelectorBody, SelectorHeader } from "./_partial";

export default function SelectorDefault() {
  const elements: ItemContext["items"] = useMemo(
    () => [
      { icon: <MdPeople />, text: "Lorem Ipsum 1", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 2", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 3", href: "/abc" },
      { icon: <MdPeople />, text: "Lorem Ipsum 4", href: "/abc" },
    ],
    [],
  );

  return (
    <ItemContextProvider elements={elements}>
      <Flexbox orient={"vertical"}>
        <SelectorHeader />
        <SelectorBody />
      </Flexbox>
    </ItemContextProvider>
  );
}
