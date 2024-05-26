"use client";
import {
  MODAL_CONTROLLER_ID_PARAM,
  ModalParameter,
} from "@/modules/modal/components";
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
  ModalParameter.apply(url.searchParams, MODAL_CONTROLLER_ID_PARAM, modal);

  return (
    <Link href={url} {...restProps}>
      {children}
    </Link>
  );
}
