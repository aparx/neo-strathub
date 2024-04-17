"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import { TeamPopover } from "@/modules/team/partial";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Icon,
  IconButton,
  Popover,
  Text,
} from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MdArrowDropDown } from "react-icons/md";
import * as css from "./layout.header.css";

export function LayoutHeader() {
  return (
    <Text className={css.header} type={"label"} size={"lg"}>
      <Navigation />
      <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton>
            <Icon.Custom icon={<MdArrowDropDown />} />
          </IconButton>
        </Popover.Trigger>
        <TeamPopover style={{ minWidth: 250 }} />
      </Popover.Root>
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
        display: teamId,
      });
    return array;
  }, [teamId]);

  return (
    <nav>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </nav>
  );
}
