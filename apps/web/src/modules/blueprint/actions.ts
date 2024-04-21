"use server";
import { createAnonServer } from "@/utils/supabase/server";
import { Enums } from "@/utils/supabase/types";
import { Nullish } from "@repo/utils";
import { cookies } from "next/headers";

export interface GetMyBlueprintsFilters {
  teamId?: Nullish<string>;
  bookId?: Nullish<string>;
  visibility?: Enums<"bp_visibility">;
  filterByName?: string;
  filterByGame?: string;
  filterByMap?: string[];
  /** Pagination cursor (exclusive) */
  cursorId?: string;
}

const BLUEPRINTS_PAGE_LIMIT = 15;

export async function getMyBlueprints(filters: GetMyBlueprintsFilters) {
  // prettier-ignore
  const query = createAnonServer(cookies())
    .from("blueprint")
    .select(`
       *, 
       book!inner(id, name, team_id, team(id, name)), 
       arena!inner(id, name, game!inner(id, name))
    `)
    .order("id")
    .order("updated_at", { ascending: false })
    .limit(BLUEPRINTS_PAGE_LIMIT);
  if (filters.cursorId) query.gt("id", filters.cursorId);

  // TODO test performance & add indexes to the SQL table
  if (filters.visibility) query.eq("visibility", filters.visibility);
  if (filters.teamId) query.eq("book.team_id", filters.teamId);
  if (filters.bookId) query.eq("book_id", filters.bookId);
  if (filters.filterByMap) query.in("arena.id", filters.filterByMap);
  if (filters.filterByGame) query.eq("game_id", filters.filterByGame);
  // TODO FTS using `filters.filterByName`

  const { data, error } = await query;

  return {
    data,
    error,
    nextCursor: data?.at(-1)?.id,
  };
}
