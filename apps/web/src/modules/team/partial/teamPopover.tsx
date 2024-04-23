"use client";
import { OpenModalLink } from "@/modules/modal/components";
import { Enums } from "@/utils/supabase/types";
import { Icon, Popover } from "@repo/ui/components";

export interface TeamPopoverProps extends Popover.PopoverContentProps {
  teamId: string;
  auth?: Enums<"member_role">;
}

export function TeamPopover({
  auth = "member",
  teamId,
  ...restProps
}: TeamPopoverProps) {
  return (
    <Popover.Content {...restProps}>
      <Popover.Item asChild>
        <OpenModalLink path={`/dashboard/${teamId}`} modal={"settings"}>
          <Icon.Mapped type={"settings"} size={"sm"} />
          Settings
        </OpenModalLink>
      </Popover.Item>
      <Popover.Item asChild>
        <OpenModalLink path={`/dashboard/${teamId}`} modal={"members"}>
          <Icon.Mapped type={"members"} size={"sm"} />
          Members
        </OpenModalLink>
      </Popover.Item>
      <Popover.Divider />
      <Popover.Item color={"destructive"}>
        <Icon.Mapped type={"leave"} size={"sm"} />
        Leave
      </Popover.Item>
    </Popover.Content>
  );
}
