"use client";
import { DashboardParams } from "@/app/(app)/dashboard/_utils";
import {
  Breadcrumbs,
  BreadcrumbsProps,
  Icon,
  Popover,
  Text,
} from "@repo/ui/components";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { MdArrowDropDown } from "react-icons/md";
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
        <Popover.Trigger>
          {/* TODO IconButton */}
          <Icon.Custom icon={<MdArrowDropDown />} />
        </Popover.Trigger>
        <Popover.Content style={{ minWidth: 250 }}>
          <Popover.Item>
            <Icon.Mapped type={"settings"} size={"sm"} />
            Settings
          </Popover.Item>
          <Popover.Item>
            <Icon.Mapped type={"members"} size={"sm"} />
            Members
          </Popover.Item>
          <Popover.Divider />
          <Popover.Item color={"destructive"}>
            <Icon.Mapped type={"delete"} size={"sm"} />
            Delete
          </Popover.Item>
        </Popover.Content>
      </Popover.Root>
    </Text>
  );
}
