"use client";
import { OpenModalLink } from "@/modules/modal/components";
import { Enums } from "@/utils/supabase/types";
import { Icon, Popover } from "@repo/ui/components";

export interface TeamPopoverProps extends Popover.PopoverContentProps {
  auth?: Enums<"member_role">;
}

export function TeamPopover({
  auth = "member",
  ...restProps
}: TeamPopoverProps) {
  return (
    <Popover.Content {...restProps}>
      <Popover.Item asChild>
        <OpenModalLink modal={"settings"}>
          <Icon.Mapped type={"settings"} size={"sm"} />
          Settings
        </OpenModalLink>
      </Popover.Item>
      <Popover.Item asChild>
        <OpenModalLink modal={"members"}>
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
