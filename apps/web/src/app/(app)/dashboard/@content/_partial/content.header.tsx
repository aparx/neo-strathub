"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ContentHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const updateFilter = useDebouncedCallback((filter: string) => {
    const newQuery = new URLSearchParams(query);
    if (!filter.length) newQuery.delete(DASHBOARD_QUERY_PARAMS.query);
    else newQuery.set(DASHBOARD_QUERY_PARAMS.query, filter);
    router.replace(`${pathname}?${newQuery.toString()}`, { scroll: false });
  }, 500);

  return (
    <div style={{ marginLeft: "auto" }}>
      <Flexbox gap={"sm"} style={{ flexGrow: 1 }}>
        <TextField
          leading={<Icon.Mapped type={"search"} color={"red"} />}
          placeholder={"Search"}
          defaultValue={query.get(DASHBOARD_QUERY_PARAMS.query) || undefined}
          onInput={(e) => updateFilter(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
        />
        <Button appearance={"icon"} aria-label={"Filter search"}>
          <Icon.Mapped type={"filterEmpty"} />
        </Button>
        <Button appearance={"icon"} aria-label={"Add blueprint"} disabled>
          <Icon.Mapped type={"add"} />
        </Button>
      </Flexbox>
    </div>
  );
}
