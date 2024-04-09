import { Flexbox, Text } from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import React, { HTMLAttributes } from "react";
import { MdMore } from "react-icons/md";
import * as css from "./listItem.css";

type ListItemBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface ListItemData {
  icon?: React.ReactNode;
  text: string;
}

export interface ListItemProps extends ListItemBaseProps, ListItemData {
  active?: boolean;
}

export function ListItem({
  icon,
  text,
  active,
  className,
  ...restProps
}: ListItemProps) {
  return (
    <Text asChild data={{ weight: 500 }}>
      <Flexbox
        justify={"space-between"}
        className={mergeClassNames(css.listItem({ active }), className)}
        {...restProps}
      >
        <Flexbox gap={"md"} align={"center"} justify={"center"}>
          {icon != null ? <div className={css.itemIcon}>{icon}</div> : null}
          {text}
        </Flexbox>
        {/* TODO */}
        <MdMore />
      </Flexbox>
    </Text>
  );
}
