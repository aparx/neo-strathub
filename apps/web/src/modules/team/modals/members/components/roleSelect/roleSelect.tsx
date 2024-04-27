"use client";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import * as Select from "@radix-ui/react-select";
import { SelectProps } from "@radix-ui/react-select";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { capitalize } from "@repo/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import * as css from "./roleSelect.css";
import { RoleSelectVariants } from "./roleSelect.css";

type RoleColor = NonNullable<RoleSelectVariants>["color"];

export interface RoleSelectProps
  extends Omit<SelectProps, "value" | "onValueChange"> {
  initialRoleId: number;
  onRoleChange?: (newRole: Tables<"team_member_role">) => any;
}

export function RoleSelect({
  initialRoleId,
  onRoleChange,
  disabled,
  ...restProps
}: RoleSelectProps) {
  const [value, setValue] = useState<string>();

  const {
    data: { data: roles },
  } = useSuspenseQuery({
    queryKey: ["teamRoles"],
    queryFn: async () => createClient().from("team_member_role").select(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const colorMap = useMemo(() => {
    const map = new Map<string, RoleColor>();
    if (!roles) return map;
    // Update the appropriate colors for each role, based on their flags
    const colorPool: RoleColor[] = ["primary", "warning", "destructive"];
    roles
      .sort((a, b) => a.flags - b.flags)
      .forEach((x, i) => map.set(x.name, colorPool[i % colorPool.length]));
    return map;
  }, [roles]);

  useEffect(() => {
    // Update the initial role
    setValue(roles?.find((x) => x.id === initialRoleId)?.name);
  }, [roles]);

  // The color of the current role
  const color = value ? colorMap.get(value) : null;

  return (
    <Select.Root
      value={value}
      onValueChange={(val) => {
        setValue(val as any);
        if (!onRoleChange) return;
        const found = roles?.find((x) => x.name === val);
        if (found) onRoleChange(found);
      }}
      disabled={disabled}
      {...restProps}
    >
      <Text asChild type={"label"} data={{ weight: 500 }}>
        <Select.Trigger
          className={css.trigger({ color: color ?? "primary" })}
          style={{ width: 120 }}
        >
          <div className={css.itemIndicator} />
          <Select.Value />
          {!disabled && (
            <Select.Icon className={css.triggerExpand}>
              <Icon.Mapped type={"expand"} size={"sm"} />
            </Select.Icon>
          )}
        </Select.Trigger>
      </Text>
      <Select.Portal>
        <Select.Content className={css.content}>
          <Select.ScrollUpButton>
            <Icon.Custom icon={<BiChevronUp />} />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {roles?.map((role) => (
              <Item
                key={role.id}
                name={role.name}
                color={colorMap.get(role.name)}
              />
            ))}
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
          <div className={css.itemIndicator} />
        </Select.ItemIndicator>
        <Select.ItemText>{capitalize(name)}</Select.ItemText>
      </Select.Item>
    </Text>
  );
}
