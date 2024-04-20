import { createServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBook = cache((bookId: string) => {
  // TODO fetch actual stratbook
  return createServer(cookies())
    .from("book")
    .select("*, team(id, name), game(id, name)")
    .eq("id", bookId)
    .maybeSingle();
});
