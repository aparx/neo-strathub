"use client";
import { Enums } from "@/utils/supabase/types";
import * as Select from "@radix-ui/react-select";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { capitalize } from "@repo/utils";
import { useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import * as css from "./roleSelect.css";
import { RoleSelectVariants } from "./roleSelect.css";

type RoleColor = NonNullable<RoleSelectVariants>["color"];

const roleMap = {
  owner: "destructive",
  editor: "warning",
  viewer: "primary",
} as const satisfies Record<Enums<"member_role">, RoleColor>;

type RoleMap = typeof roleMap;
type Role = Enums<"member_role">;

export interface RoleSelectProps {
  initialRole: keyof RoleMap;
  onRoleChange?: (newRole: Role) => any;
}

export function RoleSelect({ initialRole, onRoleChange }: RoleSelectProps) {
  const [value, setValue] = useState<Role>(initialRole);

  const color = useMemo(() => (value ? roleMap[value as Role] : null), [value]);

  return (
    <Select.Root
      value={value}
      onValueChange={(val) => {
        setValue(val as Role);
        onRoleChange?.(val as Role);
      }}
    >
      <Text asChild type={"label"} data={{ weight: 500 }}>
        <Select.Trigger
          className={css.trigger({ color: color ?? "primary" })}
          style={{ width: 120 }}
        >
          <div className={css.indicator} />
          <Select.Value />
          <Select.Icon style={{ marginLeft: "auto" }}>
            <Icon.Mapped type={"expand"} />
          </Select.Icon>
        </Select.Trigger>
      </Text>
      <Select.Portal>
        <Select.Content className={css.content}>
          <Select.ScrollUpButton>
            <Icon.Custom icon={<BiChevronUp />} />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {Object.getOwnPropertyNames(roleMap).map((key) => {
              return <Item key={key} name={key} color={roleMap[key as Role]} />;
            })}
          </Select.Viewport>
          <Select.ScrollDownButton>
            <Icon.Custom icon={<BiChevronDown />} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function Item({ name, color }: { name: string; color: RoleColor }) {
  return (
    <Text asChild type={"label"} data={{ weight: 500 }}>
      <Select.Item
        value={name}
        className={css.item}
        style={{
          color: vars.colors[color ?? "primary"].lighter,
        }}
      >
        <Select.ItemIndicator>
          <div className={css.indicator} />
        </Select.ItemIndicator>
        <Select.ItemText>{capitalize(name)}</Select.ItemText>
      </Select.Item>
    </Text>
  );
}
