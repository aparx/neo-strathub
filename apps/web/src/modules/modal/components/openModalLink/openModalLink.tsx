"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { ModalPageKey } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import Link from "next/link";
import { ComponentProps } from "react";

type OpenModalLinkBaseProps = Omit<ComponentProps<"a">, "href">;

export interface OpenModalLinkProps extends OpenModalLinkBaseProps {
  modal: ModalPageKey;
}

export function OpenModalLink({
  children,
  modal,
  ...restProps
}: OpenModalLinkProps) {
  const url = useURL();
  url.searchParams.set(DASHBOARD_QUERY_PARAMS.modal, modal);

  return (
    <Link href={url} {...restProps}>
      {children}
    </Link>
  );
}
