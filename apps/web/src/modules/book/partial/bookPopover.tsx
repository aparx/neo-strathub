import { Icon, Popover } from "@repo/ui/components";

export function BookPopover(props: Popover.PopoverContentProps) {
  return (
    <Popover.Content {...props}>
      <Popover.Item>
        <Icon.Mapped type={"rename"} size={"sm"} />
        Rename
      </Popover.Item>
      <Popover.Divider />
      <Popover.Item color={"destructive"}>
        <Icon.Mapped type={"delete"} size={"sm"} />
        Delete
      </Popover.Item>
    </Popover.Content>
  );
}
