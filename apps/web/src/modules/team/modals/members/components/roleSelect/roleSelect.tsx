"use client";
import * as Select from "@radix-ui/react-select";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { capitalize } from "@repo/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import * as css from "./roleSelect.css";
import { RoleSelectVariants } from "./roleSelect.css";

type RoleColor = NonNullable<RoleSelectVariants>["color"];

export interface RoleSelectProps {
  initialRoleId: number;
  onRoleChange?: (newRoleId: number) => any;
}

export function RoleSelect({ initialRoleId, onRoleChange }: RoleSelectProps) {
  const [value, setValue] = useState<string>();

  const { data: roles } = useGetRoles();

  useEffect(() => {}, [roles]);

  const roleColorMap = new Map<string, RoleColor>();
  if (roles) {
  }

  const color = useMemo(
    () => (value ? roleColorMap.get(value) : null),
    [value],
  );

  return (
    <Select.Root
      value={value}
      onValueChange={(val) => {
        setValue(val as any);
        onRoleChange?.(val as any);
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
            {Object.getOwnPropertyNames(roleColorMap).map((key) => {
              return (
                <Item key={key} name={key} color={roleColorMap.get(key)} />
              );
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

function useGetRoles() {
  return useSuspenseQuery({
    queryKey: ["roles"],
    queryFn: () => null,
  });
}
