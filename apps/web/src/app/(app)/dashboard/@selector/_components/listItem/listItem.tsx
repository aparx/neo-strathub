import { Flexbox, Icon, Text } from "@repo/ui/components";
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
}

export function ListItem({
  icon,
  text,
  href,
  active,
  className,
  ...restProps
}: ListItemProps) {
  return (
    <Text asChild data={{ weight: 450 }}>
      <Link
        href={href}
        className={mergeClassNames(css.listItem({ active }), className)}
        {...restProps}
      >
        <Flexbox gap={"md"} align={"center"} style={{ width: "fit-content" }}>
          {icon != null ? (
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
