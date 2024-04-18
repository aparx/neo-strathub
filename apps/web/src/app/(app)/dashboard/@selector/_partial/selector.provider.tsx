"use client";
import { ListItemData } from "@/app/(app)/dashboard/@selector/_components";
import { ItemContextProvider } from "@/app/(app)/dashboard/@selector/_context";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { TeamPopover } from "@/modules/team/partial";
import { createClient } from "@/utils/supabase/client";
import { nonNull } from "@repo/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdPeople } from "react-icons/md";

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
  const [elements, setElements] = useState<ListItemData[]>([]);

  const teamQuery = useQuery({
    queryKey: ["myTeams"],
    queryFn: () => getMyTeams(user.id),
    enabled: !params.teamId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (params.teamId || !teamQuery.data) return;
    setElements(
      teamQuery.data
        .map(({ team, role }) => {
          if (!team) return null;
          return {
            href: `/dashboard/${team.id}`,
            text: team.name,
            popover: <TeamPopover auth={role} />,
            icon: <MdPeople />,
          } satisfies ListItemData;
        })
        .filter(nonNull),
    );
  }, [teamQuery.data, params.teamId]);

  return (
    <ItemContextProvider elements={elements} fetching={teamQuery.isFetching}>
      {children}
    </ItemContextProvider>
  );
}

async function getMyTeams(userId: string) {
  return (
    await createClient()
      .from("team_member")
      .select("team(id, name), role")
      .eq("user_id", userId)
  )?.data;
}
