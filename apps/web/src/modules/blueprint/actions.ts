import { createServer } from "@/utils/supabase/server";
import { Nullish } from "@repo/utils";
import { cookies } from "next/headers";

export interface GetMyBlueprintsFilters {
  teamId?: Nullish<string>;
  bookId?: Nullish<string>;
  filterByName?: string;
  filterByGame?: string;
  filterByMap?: string[];
  /** Pagination cursor (exclusive) */
  cursorId?: string;
}

const BLUEPRINTS_PAGE_LIMIT = 15;

export async function getMyBlueprints(filters: GetMyBlueprintsFilters) {
  // prettier-ignore
  const query = createServer(cookies())
    .from("blueprint")
    .select(`
       *, 
       book(id, name, team_id, team!inner(id, name)), 
       arena(id, name, game!inner(id, name))
    `)
    .order("id", { ascending: true })
    .order("updated_at", { ascending: false })
    .limit(BLUEPRINTS_PAGE_LIMIT);
  if (filters.teamId) query.eq("book.team_id", filters.teamId);
  if (filters.bookId) query.eq("book_id", filters.bookId);
  // TODO add more filters
  if (filters.cursorId) query.gt("id", filters.cursorId);
  return query;
}
