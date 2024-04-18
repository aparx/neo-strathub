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
        <Icon.Mapped type={"leave"} size={"sm"} />
        Leave
      </Popover.Item>
    </Popover.Content>
  );
}
