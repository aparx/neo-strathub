"use server";
import { createAnonServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBook = cache(async (bookId: string) => {
  return createAnonServer(cookies())
    .from("book")
    .select("*, team(id, name, game!inner(id, name, icon))")
    .eq("id", bookId)
    .maybeSingle();
});
