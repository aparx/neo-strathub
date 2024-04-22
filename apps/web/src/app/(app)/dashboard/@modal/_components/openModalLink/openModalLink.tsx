"use client";
import { ModalPageKey } from "@/app/(app)/dashboard/@modal/modals";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
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
    <Link href={url} onClick={(e) => {}} {...restProps}>
      {children}
    </Link>
  );
}
