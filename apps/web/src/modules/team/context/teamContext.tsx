"use client";
import { useUserContext } from "@/modules/auth/context";
import { createClient } from "@/utils/supabase/client";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import { RealtimeChannel } from "@supabase/supabase-js";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TeamMemberData, useGetMembers } from "../hooks";

export interface TeamMemberPresence {
  profileId?: string;
  status?: "online" | "offline";
  /** The document this member is currently in preview of or editing */
  documentId?: string;
}

export interface TeamMember extends TeamMemberData {
  presence: TeamMemberPresence;
  slotId?: number;
}

export interface TeamContext {
  state: "loading" | "loaded";
  members: TeamMember[];
  channel: () => RealtimeChannel;
  updatePresence: (presence: TeamMemberPresence) => Promise<any>;
}

interface PresenceState {
  [profileId: string]: TeamMemberPresence;
}

const teamContext = createContext<SharedState<TeamContext> | null>(null);

export function TeamContextProvider({
  teamId,
  children,
}: {
  teamId: string;
  children?: React.ReactNode;
}) {
  const { user } = useUserContext();
  const memberQuery = useGetMembers(teamId);

  const channelRef = useRef<RealtimeChannel>();
  const { presence, updatePresence } = useTeamChannel(
    teamId,
    channelRef,
    !!memberQuery.data?.data?.find((x) => x.profile_id === user?.id),
  );

  // Remap members to include presence
  const members = useMemo(() => {
    if (!memberQuery.data?.data) return [];
    return memberQuery.data.data.map<TeamMember>((member) => ({
      ...member,
      presence: {
        profileId: member.profile_id,
        status: "offline",
        ...presence[member.profile_id],
      },
    }));
  }, [memberQuery.data?.data, presence]);

  const context = useSharedState<TeamContext>({
    state: "loading",
    members,
    channel: () => {
      const channel = channelRef.current;
      if (!channel) throw new Error("Channel is not initialized");
      return channel;
    },
    updatePresence,
  });

  useEffect(() => {
    context.update((oldContext) => ({
      ...oldContext,
      members,
      state: "loaded",
    }));
  }, [members]);

  return (
    <teamContext.Provider value={context}>{children}</teamContext.Provider>
  );
}

export function useTeamContext(): [
  TeamContext,
  Dispatch<SetStateAction<TeamContext>>,
] {
  const ctx = useContext(teamContext);
  if (!ctx) throw new Error("Missing TeamContext");
  return [ctx.state, ctx.update];
}

/** This hook creates a realtime channel and subscribes to presence updates */
function useTeamChannel(
  teamId: string,
  channelOut: MutableRefObject<RealtimeChannel | undefined>,
  /** True if this user is a member of given team (if so, shared state) */
  isMember?: boolean,
) {
  const { user } = useUserContext();
  const [presence, setPresence] = useState<PresenceState>({});
  const flushedRef = useRef(false);
  const queuedRef = useRef<TeamMemberPresence>();

  const queue = useCallback(async (newPresence: TeamMemberPresence) => {
    if (!flushedRef.current) {
      queuedRef.current = { ...queuedRef.current, ...newPresence };
    } else {
      const channel = channelOut.current;
      if (!channel) throw new Error("Channel is not initialized");
      if (!user?.id) throw new Error("Not authorized to queue presence");
      await channel.track({ profileId: user.id, ...newPresence });
    }
  }, []);

  // Subscribe to presence events
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`team_${teamId}`);
    channelOut.current = channel;
    channel
      .on("presence", { event: "sync" }, () => {
        const newState = {} as PresenceState;
        Object.values(channel.presenceState())
          .flatMap((x) => x as TeamMemberPresence[])
          .filter((x) => x.profileId)
          .forEach((presence) => (newState[presence.profileId!] = presence));
        setPresence(newState);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED" || !user?.id || !isMember) return;
        const newState = queuedRef.current;
        queuedRef.current = undefined; // Free for GC
        flushedRef.current = true;
        await channel.track({
          profileId: user.id,
          status: "online",
          ...newState,
        } satisfies TeamMemberPresence);
      });
    return () => {
      flushedRef.current = false;
      channelOut.current = undefined;
      supabase.removeChannel(channel);
    };
  }, [isMember]);

  return {
    presence,
    updatePresence: queue,
  } as const;
}
