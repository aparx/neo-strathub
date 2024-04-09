"use client";

import { useItemContext } from "../_context";

export function SelectorHeader() {
  const { filter } = useItemContext();

  return (
    <div>
      <input
        type="text"
        placeholder={"Search"}
        onInput={(e) => filter.update(e.currentTarget.value)}
      />
    </div>
  );
}
