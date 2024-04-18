"use client";
import {
  Flexbox,
  Icon,
  IconButton,
  Popover,
  Spinner,
  Text,
} from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { HTMLAttributes, useRef } from "react";
import * as css from "./listItem.css";

type ListItemBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface ListItemData {
  icon?: React.ReactNode;
  popover?: React.ReactNode | null;
  text: string;
  href: string;
}

export interface ListItemProps extends ListItemBaseProps, ListItemData {
  active?: boolean;
  loading?: boolean;
  onRedirect?: () => any;
}

export function ListItem({
  icon,
  text,
  href,
  active,
  loading,
  className,
  onClick,
  popover,
  onRedirect,
  ...restProps
}: ListItemProps) {
  // This component contains three interactive elements:
  //
  // (1) For ease of use a clickable `div` element, with its interactivity not
  //     semantically displayed, to allow for nested "buttons" on most devices.
  //     This division uses the router to manually redirect to the provided `href`,
  //     unless any other interactable element within it is pressed.
  //
  //     (1.1) A link that semantically represents a navigation to screen-readers.
  //
  //     (1.2) A button acting as the settings button, outside the link and within
  //           the interactable division element.
  //
  // This allows for an app-like feel while not throwing accessibility out the window.

  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);

  return (
    <Text asChild data={{ weight: 450 }}>
      <div
        onClick={(e) => {
          onClick?.(e);
          const target = e.target as Node;
          if (linkRef.current?.contains(target) || target === e.currentTarget) {
            router.replace(href);
            onRedirect?.();
          }
        }}
        className={mergeClassNames(
          css.listItem({ active, loading }),
          className,
        )}
        {...restProps}
      >
        <Link href={href} ref={linkRef}>
          <Flexbox gap={"md"} align={"center"} style={{ width: "fit-content" }}>
            {loading ? (
              <Icon.Custom
                icon={<Spinner size={"1em"} />}
                className={css.itemIcon}
              />
            ) : icon != null ? (
              <Icon.Custom icon={icon} className={css.itemIcon} />
            ) : null}
            {text}
          </Flexbox>
        </Link>
        <Popover.Root>
          <Popover.Trigger asChild>
            <IconButton aria-label={"Settings"} disabled={!popover || loading}>
              <Icon.Mapped type={"details"} />
            </IconButton>
          </Popover.Trigger>
          {popover}
        </Popover.Root>
      </div>
    </Text>
  );
}
