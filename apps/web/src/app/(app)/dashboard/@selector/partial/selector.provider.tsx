"use client";
import { ListItemData } from "@/app/(app)/dashboard/@selector/components";
import { ItemContextProvider } from "@/app/(app)/dashboard/@selector/context";
import {
  DASHBOARD_QUERY_PARAMS,
  DashboardParams,
} from "@/app/(app)/dashboard/_utils";
import { BookPopover } from "@/modules/book/partial/bookPopover";
import { TeamPopover } from "@/modules/team/partial";
import { createClient } from "@/utils/supabase/client";
import { nonNull } from "@repo/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MdCollections, MdPeople } from "react-icons/md";

/**
 * Provides context and fetches data necessary for the selector.
 * Such data, for example, is the auth's teams and more.
 *
 * @param children the children capable of using the context
 * @param user the authorized auth (e.g. passed down by a server component)
 * @constructor
 */
export function SelectorDataProvider({
  children,
  user,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const params = useParams<Partial<DashboardParams>>();

  return params.teamId ? (
    <BooksProvider teamId={params.teamId}>{children}</BooksProvider>
  ) : (
    <TeamsProvider userId={user.id}>{children}</TeamsProvider>
  );
}

function TeamsProvider({
  children,
  userId,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const [isFetching, data] = useGetTeams(userId);

  const elements = useMemo(() => {
    if (!data) return [];
    return data
      .map(({ team, role }) => {
        if (!team) return null;
        return {
          href: `/dashboard/${team.id}`,
          text: team.name,
          popover: <TeamPopover teamId={team.id} auth={role} />,
          icon: <MdPeople />,
        } satisfies ListItemData;
      })
      .filter(nonNull);
  }, [data]);

  return (
    <ItemContextProvider elements={elements} fetching={isFetching}>
      {children}
    </ItemContextProvider>
  );
}

function BooksProvider({
  children,
  teamId,
}: {
  teamId: string;
  children: React.ReactNode;
}) {
  const [isFetching, data] = useGetBooks(teamId);

  const elements = useMemo(() => {
    if (!data) return [];
    return data.map(({ id, name }) => {
      const searchParams = new URLSearchParams();
      searchParams.set(DASHBOARD_QUERY_PARAMS.book, id);
      return {
        href: `/dashboard/${teamId}?${searchParams.toString()}`,
        text: name,
        popover: <BookPopover />,
        icon: <MdCollections />,
      } satisfies ListItemData;
    });
  }, [data]);

  return (
    <ItemContextProvider elements={elements} fetching={isFetching}>
      {children}
    </ItemContextProvider>
  );
}

function useGetTeams(userId: string) {
  const { isFetching, data } = useQuery({
    queryKey: ["teams", userId],
    queryFn: async () => {
      return (
        await createClient()
          .from("team_member")
          .select("team(id, name), role")
          .eq("profile_id", userId)
      )?.data;
    },
    refetchOnWindowFocus: false,
  });
  return [isFetching, data] as const;
}

function useGetBooks(teamId: string) {
  const { isFetching, data } = useQuery({
    queryKey: ["books", teamId],
    queryFn: async () => {
      return (
        await createClient()
          .from("book")
          .select("id, name")
          .eq("team_id", teamId)
      )?.data;
    },
    refetchOnWindowFocus: false,
  });
  return [isFetching, data] as const;
}
