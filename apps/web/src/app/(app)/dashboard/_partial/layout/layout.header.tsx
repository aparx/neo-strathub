"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { getTeam } from "@/modules/team/actions";
import { TeamPopover } from "@/modules/team/partial";
import { vars } from "@repo/theme";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Icon,
  IconButton,
  Popover,
  Skeleton,
  Text,
} from "@repo/ui/components";
import { useQuery } from "@tanstack/react-query";
import { calc } from "@vanilla-extract/css-utils";
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
  const { data } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => (await getTeam(teamId))?.data,
  });
  const [state, setState] = useState(false);
  const name = data?.name;
  if (!name?.length)
    return (
      <Skeleton
        width={125}
        height={calc.add(
          vars.fontSizes.body.md,
          calc.multiply(2, vars.spacing.sm),
        )}
      />
    );
  return (
    <Popover.Root onOpenChange={setState}>
      <Popover.Trigger asChild>
        <IconButton
          className={css.teamButtonAnimation}
          style={{
            color: vars.colors.emphasis.high,
            fontWeight: "inherit",
          }}
        >
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
