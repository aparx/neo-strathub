"use client";

import { createClient } from "@/utils/supabase/client";
import { InferAsync } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";

export const GAME_OBJECT_TYPES = ["character", "gadget"] as const;

export type GameObjectType = (typeof GAME_OBJECT_TYPES)[number];

export type GameObjectMap = InferAsync<ReturnType<typeof fetchGameObjects>>;

export type GameObjectData = NonNullable<GameObjectMap>[keyof GameObjectMap];

async function fetchGameObjects(gameId: number) {
  const qb = createClient().from("game_object").select().eq("game_id", gameId);
  const objectData = (await qb).data;
  if (!objectData) return null;
  const objectMap = {} as Record<number, (typeof objectData)[number]>;
  objectData.forEach((object) => (objectMap[object.id] = object));
  return objectMap;
}

export function useGetGameObjects(gameId: number) {
  return useQuery({
    queryKey: ["gameObjects", gameId],
    queryFn: async () => fetchGameObjects(gameId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
