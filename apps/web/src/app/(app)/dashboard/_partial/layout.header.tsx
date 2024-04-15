"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Popover,
  Text,
} from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MdDelete, MdPeople, MdSettings } from "react-icons/md";
import * as css from "./layout.header.css";

export function LayoutHeader() {
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
    <Text className={css.header} type={"label"} size={"lg"}>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Popover.Root>
        <Popover.Trigger>Click me</Popover.Trigger>
        <Popover.Content style={{ minWidth: 250 }}>
          <Popover.Item>
            <MdSettings />
            Settings
          </Popover.Item>
          <Popover.Item>
            <MdPeople />
            Members
          </Popover.Item>
          <Popover.Divider />
          <Popover.Item color={"destructive"}>
            <MdDelete />
            Delete
          </Popover.Item>
        </Popover.Content>
      </Popover.Root>
    </Text>
  );
}
