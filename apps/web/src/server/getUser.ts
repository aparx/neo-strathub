"use server";
import { getServer } from "@/server";
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
