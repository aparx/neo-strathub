"use server";
import { getServer } from "@/utils/supabase/actions";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBook = cache(async (bookId: string) => {
  return getServer(cookies())
    .from("book")
    .select("*, team(id, name, game!inner(id, name, icon))")
    .eq("id", bookId)
    .maybeSingle();
});
