import { getServer } from "@/utils/supabase/actions";
import type { cookies } from "next/headers";
import { cache } from "react";

export const getUser = cache(
  async (cookieStore: ReturnType<typeof cookies>) => {
    const server = getServer(cookieStore);
    const {
      data: { user },
    } = await server.auth.getUser();
    return user;
  },
);

export const getProfile = cache(
  async (cookieStore: ReturnType<typeof cookies>) => {
    const server = getServer(cookieStore);
    const user = await getUser(cookieStore);
    if (!user) return null;
    const { data } = await server
      .from("profile")
      .select()
      .eq("id", user.id)
      .maybeSingle();
    return data;
  },
);
