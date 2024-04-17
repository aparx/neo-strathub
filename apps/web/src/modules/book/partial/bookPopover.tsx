import { Icon, Popover } from "@repo/ui/components";

export interface BookPopoverProps extends Popover.PopoverContentProps {
  auth?: "admin" | "member";
}

export function BookPopover({
  auth = "member",
  ...restProps
}: BookPopoverProps) {
  return (
    <Popover.Content {...restProps}>
      <Popover.Item>
        <Icon.Mapped type={"rename"} size={"sm"} />
        Rename
      </Popover.Item>
      {auth === "admin" && (
        <>
          <Popover.Divider />
          <Popover.Item color={"destructive"}>
            <Icon.Mapped type={"delete"} size={"sm"} />
            Delete
          </Popover.Item>
        </>
      )}
    </Popover.Content>
  );
}
