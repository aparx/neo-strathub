"use client";
import type { TeamModalType } from "@/app/(app)/dashboard/@modal/[teamId]/page";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { useURL } from "@/utils/hooks";
import { Enums } from "@/utils/supabase/types";
import { Icon, Popover } from "@repo/ui/components";
import Link from "next/link";
import { ComponentProps } from "react";

export interface TeamPopoverProps extends Popover.PopoverContentProps {
  auth?: Enums<"member_role">;
}

export function TeamPopover({
  auth = "member",
  ...restProps
}: TeamPopoverProps) {
  const url = useURL();

  return (
    <Popover.Content {...restProps}>
      <Popover.Item asChild>
        <RedirectToModalLink modal={"settings"}>
          <Icon.Mapped type={"settings"} size={"sm"} />
          Settings
        </RedirectToModalLink>
      </Popover.Item>
      <Popover.Item asChild>
        <RedirectToModalLink modal={"members"}>
          <Icon.Mapped type={"members"} size={"sm"} />
          Members
        </RedirectToModalLink>
      </Popover.Item>
      <Popover.Divider />
      <Popover.Item color={"destructive"}>
        <Icon.Mapped type={"leave"} size={"sm"} />
        Leave
      </Popover.Item>
    </Popover.Content>
  );
}

function RedirectToModalLink({
  children,
  modal,
  ...restProps
}: Omit<ComponentProps<"a">, "href"> & {
  children: React.ReactNode;
  modal: TeamModalType;
}) {
  const url = useURL();
  url.searchParams.set(DASHBOARD_QUERY_PARAMS.modal, modal);
  return (
    <Link href={url} {...restProps}>
      {children}
    </Link>
  );
}
