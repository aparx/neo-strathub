"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { useTeam } from "@/modules/team/hooks";
import { TeamPopover } from "@/modules/team/partial";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Icon,
  IconButton,
  Popover,
  Skeleton,
  Text,
} from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MdExpandMore } from "react-icons/md";
import * as css from "./layout.header.css";

export function LayoutHeader() {
  return (
    <Text className={css.header} type={"label"} size={"lg"}>
      <Navigation />
    </Text>
  );
}

function Navigation() {
  const { teamId } = useParams<Partial<DashboardParams>>();

  const breadcrumbs = useMemo(() => {
    const array: BreadcrumbsProps["breadcrumbs"] = [];
    array.push({
      href: "/dashboard",
      display: "Dashboard",
      forceRefetch: true,
    });
    if (teamId)
      // TODO replace `display: teamId` with a custom component (+ dropdown)
      array.push({
        href: "/team",
        display: <TeamButton teamId={teamId} />,
      });
    return array;
  }, [teamId]);

  return (
    <nav>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </nav>
  );
}

function TeamButton({ teamId }: { teamId: string }) {
  const { data } = useTeam(teamId);
  const [state, setState] = useState(false);
  const name = data?.name;
  if (!name?.length) return <Skeleton width={100} />;

  return (
    <Popover.Root onOpenChange={setState}>
      <Popover.Trigger asChild>
        <IconButton className={css.teamButton}>
          {name}
          <Icon.Custom
            icon={<MdExpandMore />}
            style={{
              transition: "150ms",
              rotate: state ? "-180deg" : "unset",
            }}
          />
        </IconButton>
      </Popover.Trigger>
      <TeamPopover style={{ minWidth: 250 }} />
    </Popover.Root>
  );
}
