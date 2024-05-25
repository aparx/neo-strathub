"use client";
import { OpenModalLink } from "@/modules/modal/components";
import { USE_GET_TEAM_SEARCH_PARAM } from "@/modules/modal/hooks";
import { useURL } from "@/utils/hooks";
import { Icon, Popover } from "@repo/ui/components";
import { usePathname } from "next/navigation";

export interface TeamPopoverProps extends Popover.PopoverContentProps {
  teamId: string;
  /** This will make it, so the URL will not change to the team directly */
  invokeExternal?: boolean;
}

export function TeamPopover({
  teamId,
  invokeExternal,
  ...restProps
}: TeamPopoverProps) {
  const pathname = usePathname();
  const url = useURL();
  url.pathname = invokeExternal ? pathname : `/dashboard/${teamId}`;
  if (invokeExternal) url.searchParams.set(USE_GET_TEAM_SEARCH_PARAM, teamId);

  return (
    <Popover.Content {...restProps}>
      <Popover.Item asChild>
        <OpenModalLink href={url} modal={"settings"}>
          <Icon.Mapped type={"settings"} size={"sm"} />
          Settings
        </OpenModalLink>
      </Popover.Item>
      <Popover.Item asChild>
        <OpenModalLink href={url} modal={"members"}>
          <Icon.Mapped type={"members"} size={"sm"} />
          Members
        </OpenModalLink>
      </Popover.Item>
      <Popover.Item asChild>
        <OpenModalLink href={url} modal={"auditLog"}>
          <Icon.Mapped type={"log"} size={"sm"} />
          Audit Log
        </OpenModalLink>
      </Popover.Item>
      <Popover.Divider />
      <Popover.Item asChild color={"destructive"}>
        <OpenModalLink href={url} modal={"leave"}>
          <Icon.Mapped type={"leave"} size={"sm"} />
          Leave
        </OpenModalLink>
      </Popover.Item>
    </Popover.Content>
  );
}
