"use client";

import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { useURL } from "@/utils/hooks";
import { Icon, IconButton } from "@repo/ui/components";
import Link from "next/link";
import { HTMLAttributes } from "react";

export type ExitInspectorButtonProps = Omit<
  HTMLAttributes<HTMLAnchorElement>,
  "children"
>;

export function ExitInspectorButton(props: ExitInspectorButtonProps) {
  const url = useURL();
  url.searchParams.delete(DASHBOARD_QUERY_PARAMS.document);
  return (
    <IconButton asChild aria-label={"Close inspector"}>
      <Link href={url.href} {...props}>
        <Icon.Mapped type={"close"} />
      </Link>
    </IconButton>
  );
}
