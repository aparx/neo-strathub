import { Flexbox, Icon, Spinner, Text } from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import Link from "next/link";
import React, { HTMLAttributes } from "react";
import { MdMoreVert } from "react-icons/md";
import * as css from "./listItem.css";

type ListItemBaseProps = Omit<HTMLAttributes<HTMLAnchorElement>, "children">;

export interface ListItemData {
  icon?: React.ReactNode;
  text: string;
  href: string;
}

export interface ListItemProps extends ListItemBaseProps, ListItemData {
  active?: boolean;
  loading?: boolean;
}

export function ListItem({
  icon,
  text,
  href,
  active,
  loading,
  className,
  ...restProps
}: ListItemProps) {
  return (
    <Text asChild data={{ weight: 450 }}>
      <Link
        href={href}
        className={mergeClassNames(
          css.listItem({ active, loading }),
          className,
        )}
        {...restProps}
      >
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
        {/* TODO */}
        <MdMoreVert size={"1.2em"} />
      </Link>
    </Text>
  );
}
