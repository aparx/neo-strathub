"use server";
import { createAnonServer } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";

export const getBook = cache((bookId: string) => {
  return createAnonServer(cookies())
    .from("book")
    .select("*, team(id, name), game(id, name, icon)")
    .eq("id", bookId)
    .maybeSingle();
});