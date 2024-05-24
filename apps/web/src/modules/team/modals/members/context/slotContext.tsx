"use client";

import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { Nullish } from "@repo/utils";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo } from "react";

export interface SlotContextMember extends Pick<Tables<"team_member">, "id"> {
  profile: Pick<Tables<"profile">, "id" | "name" | "avatar">;
}

export interface SlotContextSlot
  extends Pick<Tables<"player_slot">, "id" | "color" | "index"> {
  members: SlotContextMember[];
}

export type SlotContextData = Nullish | SlotContextSlot[];

export interface SlotContext {
  data: SharedState<SlotContextData>;
  refetch: () => Promise<any>;
  isFetching: boolean;
}

const slotContext = createContext<SlotContext | null>(null);

async function fetchSlots(teamId: string) {
  return createClient().from("player_slot").select().eq("team_id", teamId);
}

async function fetchMembers(slotIds: number[]) {
  const { data, error } = await createClient()
    .from("member_to_player_slot")
    .select("slot_id, team_member!inner(id, profile!inner(id, name, avatar))")
    .order("updated_at")
    .in("slot_id", slotIds);
  if (error) return { error } as const;
  const memberMap = new Map<number, SlotContextMember[]>();
  data?.forEach(({ team_member, slot_id }) => {
    const arr = memberMap.get(slot_id) ?? [];
    memberMap.set(slot_id, [...arr, team_member]);
  });
  return { data: memberMap };
}

export function SlotContextProvider({
  children,
  teamId,
}: {
  children: React.ReactNode;
  teamId: string;
}) {
  // Get an array of all slots available for `teamId`
  const slotQuery = useQuery({
    queryKey: ["memberSlots", teamId],
    queryFn: async () => await fetchSlots(teamId),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const slotIds = useMemo(
    () => slotQuery.data?.data?.map((x) => x.id),
    [slotQuery.data?.data],
  );

  // Get a map of all members associated to their respective `slot_id`
  const memberQuery = useQuery({
    queryKey: ["slotMembers", JSON.stringify(slotIds)],
    queryFn: async () => await fetchMembers(slotIds ?? []),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const slotQueryData = slotQuery.data?.data;
  const memberQueryData = memberQuery.data?.data;

  // The resulting array being put into the data cache
  const dataArray = useMemo<SlotContextData>(
    () =>
      slotQueryData?.map((slot) => ({
        members: memberQueryData?.get(slot.id) ?? [],
        ...slot,
      })),
    [slotQueryData, memberQueryData],
  );

  const dataCache = useSharedState<SlotContextData>(dataArray);
  useEffect(() => dataCache.update(dataArray), [dataArray]);

  const context = useMemo<SlotContext>(
    () => ({
      data: dataCache,
      isFetching: memberQuery.isFetching || slotQuery.isFetching,
      refetch: async () => await memberQuery.refetch(),
    }),
    [dataCache, memberQuery, slotQuery],
  );

  return (
    <slotContext.Provider value={context}>{children}</slotContext.Provider>
  );
}

export function useSlotContext(): NonNullable<SlotContext> {
  const ctx = useContext(slotContext);
  if (!ctx) throw new Error("Missing SlotContext");
  return ctx;
}
