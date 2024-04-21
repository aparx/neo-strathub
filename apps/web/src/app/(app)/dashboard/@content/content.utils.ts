import type { GetMyBlueprintsFilters } from "@/modules/blueprint/actions";

export const CONTENT_SEARCH_PARAMS = {
  filterByName: "q",
  filterByArena: "arenas",
} as const satisfies Partial<Record<keyof GetMyBlueprintsFilters, string>>;
