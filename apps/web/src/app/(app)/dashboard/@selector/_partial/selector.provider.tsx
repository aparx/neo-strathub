"use client";
import { ListItemData } from "@/app/(app)/dashboard/@selector/_components";
import { ItemContextProvider } from "@/app/(app)/dashboard/@selector/_context";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { BookPopover } from "@/modules/book/partial/bookPopover";
import { TeamPopover } from "@/modules/team/partial";
import { User } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MdGames, MdPeople } from "react-icons/md";

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

  // TODO useQuery that refetches and invalidates initial data on URL change
  // TODO actually cache, re-cache & translate input into items
  const elements = useFetchElements({
    type: params.teamId ? "book" : "team",
    teamId: params.teamId!,
  });

  return (
    <ItemContextProvider elements={elements} fetching={false}>
      {children}
    </ItemContextProvider>
  );
}

type UseFetchElementsProps =
  | { type: "team" }
  | { type: "book"; teamId: string };

function useFetchElements(data: UseFetchElementsProps) {
  // TODO actually fetch the data
  return useMemo(() => {
    const arr = new Array(5);
    for (let i = 1; i <= 5; ++i) {
      let href: string;
      switch (data.type) {
        case "team":
          href = `/dashboard/${i}`;
          break;
        case "book":
          href = `/dashboard/${data.teamId}/${i}`;
          break;
        default:
          throw new Error("Invalid data type");
      }

      arr[i] = {
        icon: data.type === "team" ? <MdPeople /> : <MdGames />,
        text: `${data.type === "team" ? "Team" : "Stratbook"} ${i}`,
        popover:
          data.type === "team" ? (
            <TeamPopover auth={"admin"} />
          ) : (
            <BookPopover auth={"admin"} />
          ),
        href,
      } satisfies ListItemData;
    }
    return arr;
  }, [data.type, data.type === "book" ? data.teamId : null]);
}
