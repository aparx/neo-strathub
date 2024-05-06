"use client";
import { CONTENT_SEARCH_PARAMS } from "@/app/(app)/dashboard/@content/content.utils";
import { Button, Flexbox, Icon, TextField } from "@repo/ui/components";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function ContentHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const updateFilter = useDebouncedCallback((filter: string) => {
    const newQuery = new URLSearchParams(query);
    if (!filter.length) newQuery.delete(CONTENT_SEARCH_PARAMS.filterByName);
    else newQuery.set(CONTENT_SEARCH_PARAMS.filterByName, filter);
    router.replace(`${pathname}?${newQuery.toString()}`, { scroll: false });
  }, 500);

  return (
    <div style={{ marginLeft: "auto" }}>
      <Flexbox gap={"sm"} style={{ flexGrow: 1 }}>
        <Flexbox asChild gap={"sm"} style={{ flexGrow: 1 }}>
          <search>
            <TextField
              leading={<Icon.Mapped type={"search"} color={"red"} />}
              placeholder={"Search"}
              defaultValue={
                query.get(CONTENT_SEARCH_PARAMS.filterByName) || undefined
              }
              onInput={(e) => updateFilter(e.currentTarget.value)}
              style={{ flexGrow: 1 }}
            />
            <Button appearance={"icon"} aria-label={"Filter search"}>
              <Icon.Mapped type={"filterEmpty"} />
            </Button>
          </search>
        </Flexbox>
        <Button appearance={"icon"} aria-label={"Add blueprint"} disabled>
          <Icon.Mapped type={"add"} />
        </Button>
      </Flexbox>
    </div>
  );
}
