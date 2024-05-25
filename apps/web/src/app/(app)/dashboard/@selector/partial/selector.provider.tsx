"use client";
import {
  SelectorGameImage,
  SelectorListItemData,
} from "@/app/(app)/dashboard/@selector/components";
import { SelectorItemContextProvider } from "@/app/(app)/dashboard/@selector/context";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { BookPopover } from "@/modules/book/partial/bookPopover";
import { TeamPopover } from "@/modules/team/partial";
import { createClient } from "@/utils/supabase/client";
import { nonNull } from "@repo/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MdCollections } from "react-icons/md";

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
  const params = useParams<{ teamId?: string }>();

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
  const { isFetching, data } = useQuery({
    queryKey: ["teams", userId],
    queryFn: async () => {
      return (
        await createClient()
          .from("team_member")
          .select("team(id, name, game!inner(id, name, icon))")
          .order("created_at")
          .eq("profile_id", userId)
      )?.data;
    },
    refetchOnWindowFocus: false,
  });

  const elements = useMemo(() => {
    if (!data) return [];
    return data
      .map((element) => element.team)
      .filter(nonNull)
      .map<SelectorListItemData>(({ id, name, game }) => ({
        href: `/dashboard/${id}`,
        text: name,
        popover: <TeamPopover teamId={id} invokeExternal />,
        icon: <SelectorGameImage src={game.icon} name={game.name} />,
      }));
  }, [data]);

  return (
    <SelectorItemContextProvider elements={elements} loading={isFetching}>
      {children}
    </SelectorItemContextProvider>
  );
}

function BooksProvider({
  children,
  teamId,
}: {
  teamId: string;
  children: React.ReactNode;
}) {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ["books", teamId],
    queryFn: async () => {
      return (
        await createClient()
          .from("book")
          .select("id, name")
          .order("created_at")
          .eq("team_id", teamId)
      )?.data;
    },
    refetchOnWindowFocus: false,
  });

  const searchParams = useSearchParams();
  const bookParam = searchParams.get(DASHBOARD_QUERY_PARAMS.book);

  useEffect(() => {
    if (!isLoading && bookParam && !data?.find((x) => x.id === bookParam))
      refetch(); // Book does not exist in cache, try and refetch
  }, [bookParam]);

  const elements = useMemo(() => {
    if (!data) return [];
    return data.map(({ id, name }) => {
      const searchParams = new URLSearchParams();
      searchParams.set(DASHBOARD_QUERY_PARAMS.book, id);

      return {
        href: `/dashboard/${teamId}?${searchParams.toString()}`,
        text: name,
        popover: <BookPopover bookId={id} bookName={name} />,
        icon: <MdCollections />,
      } satisfies SelectorListItemData;
    });
  }, [data]);

  return (
    <SelectorItemContextProvider elements={elements} loading={isLoading}>
      {children}
    </SelectorItemContextProvider>
  );
}
