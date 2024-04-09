"use client";

import { ItemContextProvider } from "./_context";
import { SelectorHeader } from "./_partial";

export default function SelectorDefault() {
  return (
    <ItemContextProvider elements={[]}>
      <SelectorHeader />
    </ItemContextProvider>
  );
}
