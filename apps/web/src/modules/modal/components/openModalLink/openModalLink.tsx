"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { ModalPageKey } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import Link from "next/link";
import { ComponentProps } from "react";

type OpenModalLinkBaseProps = Omit<ComponentProps<"a">, "href">;

export interface OpenModalLinkProps extends OpenModalLinkBaseProps {
  path?: string;
  modal: ModalPageKey;
}

export function OpenModalLink({
  children,
  path,
  modal,
  ...restProps
}: OpenModalLinkProps) {
  const url = useURL();
  if (path != null) url.pathname = path;
  url.searchParams.set(DASHBOARD_QUERY_PARAMS.modal, modal);

  return (
    <Link href={url} {...restProps}>
      {children}
    </Link>
  );
}
