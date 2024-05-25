"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { ModalPageKey } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import Link from "next/link";
import { ComponentProps } from "react";

type OpenModalLinkBaseProps = Omit<ComponentProps<"a">, "href">;

export interface OpenModalLinkProps extends OpenModalLinkBaseProps {
  href?: string | URL;
  modal: ModalPageKey;
}

export function OpenModalLink({
  children,
  href,
  modal,
  ...restProps
}: OpenModalLinkProps) {
  let url = useURL();
  if (typeof href === "string") url.pathname = href;
  else if (typeof href === "object") url = href;
  url.searchParams.set(DASHBOARD_QUERY_PARAMS.modal, modal);

  return (
    <Link href={url} {...restProps}>
      {children}
    </Link>
  );
}
