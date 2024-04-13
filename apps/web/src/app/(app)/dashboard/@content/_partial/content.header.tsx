"use client";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const FILTER_KEY = "filter";

export function ContentHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const updateFilter = useDebouncedCallback((filter: string) => {
    const query = new URLSearchParams();
    query.set(FILTER_KEY, filter);
    router.replace(`${pathname}?${query.toString()}`, { scroll: false });
  }, 500);

  return (
    <div style={{ marginLeft: "auto" }}>
      <Flexbox gap={"sm"} style={{ flexGrow: 1 }}>
        <TextField
          leading={<Icon.Mapped type={"search"} color={"red"} />}
          placeholder={"Search"}
          defaultValue={useSearchParams().get(FILTER_KEY) || undefined}
          onInput={(e) => updateFilter(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
        <Button appearance={"icon"}>
          <Icon.Mapped type={"add"} />
        </Button>
      </Flexbox>
    </div>
  );
}
