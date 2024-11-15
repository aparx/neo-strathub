"use client";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import * as Select from "@radix-ui/react-select";
import { SelectProps } from "@radix-ui/react-select";
import { vars } from "@repo/theme";
import { Icon, Skeleton, Text } from "@repo/ui/components";
import { Nullish, capitalize } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { calc } from "@vanilla-extract/css-utils";
import { useEffect, useMemo, useState } from "react";
import * as css from "./roleSelect.css";
import { RoleSelectVariants } from "./roleSelect.css";

export type RoleData = DeepInferUseQueryResult<typeof useGetRoles>;

type RoleColor = NonNullable<RoleSelectVariants>["color"];

type RoleSelectBaseProps = Omit<SelectProps, "value" | "onValueChange">;

export interface RoleSelectProps extends RoleSelectBaseProps {
  width?: number | string;
  initialRoleId: number;
  onSelect?: (newRole: RoleData) => any;
  shouldInclude?: (role: RoleData) => boolean;
}

/** Referencing the height of the `RoleSelect` component */
export const ROLE_SELECT_HEIGHT = calc.add(
  vars.fontSizes.label.md,
  calc.multiply(2, vars.spacing.sm),
);

/** Hook that fetches all possible team actions roles */
function useGetRoles() {
  return useQuery({
    queryKey: ["teamRoles"],
    queryFn: async () => await createClient().from("member_role").select(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}

type RoleColorMap = Map<string, RoleColor>;

/** Hook that returns a map containing colors associated to roles' names */
function useRoleColorMap(roles: Nullish<RoleData[]>) {
  // TODO this might be moved to a context in future versions
  return useMemo(() => {
    const map: RoleColorMap = new Map();
    if (!roles) return map;
    // Update the appropriate colors for each role, based on their flags
    const colorPool: RoleColor[] = ["primary", "warning", "destructive"];
    roles
      .sort((a, b) => a.flags - b.flags)
      .forEach((x, i) => map.set(x.name, colorPool[i % colorPool.length]));
    return map;
  }, [roles]);
}

export function RoleSelect({
  width,
  initialRoleId,
  shouldInclude,
  onSelect,
  disabled,
  ...restProps
}: RoleSelectProps) {
  const [active, setActive] = useState<string>();
  const { data, isLoading } = useGetRoles();
  const roles = useMemo(() => {
    let newArray: Role[];
    if (!shouldInclude) newArray = data?.data;
    else newArray = data?.data?.filter(shouldInclude);
    return newArray?.sort((a, b) => b.flags - a.flags);
  }, [data?.data]);

  const colorMap = useRoleColorMap(roles);

  useEffect(
    () => setActive(roles?.find((x) => x.id === initialRoleId)?.name),
    [roles],
  );

  if (isLoading)
    return (
      <Skeleton
        width={width}
        height={ROLE_SELECT_HEIGHT}
        roundness={"full"}
        outline
      />
    );

  return (
    <Select.Root
      value={active}
      onValueChange={(val) => {
        setActive(val);
        const newRole = roles?.find((x) => x.name === val);
        if (newRole) onSelect?.(newRole);
      }}
      disabled={disabled}
      {...restProps}
    >
      <Trigger
        color={active ? colorMap.get(active) : null}
        width={width}
        disabled={disabled}
      />
      <Portal roles={roles} colorMap={colorMap} />
    </Select.Root>
  );
}

function Trigger({
  color,
  width,
  disabled,
}: {
  color: Nullish<RoleColor>;
  width?: string | number;
  disabled?: boolean;
}) {
  return (
    <Text asChild type={"label"} data={{ weight: 500 }}>
      <Select.Trigger
        className={css.trigger({ color: color ?? "primary" })}
        style={{ minWidth: width }}
      >
        <Select.Value />
        {!disabled && (
          <Select.Icon className={css.triggerExpand}>
            <Icon.Mapped type={"expand"} size={"sm"} />
          </Select.Icon>
        )}
      </Select.Trigger>
    </Text>
  );
}

function Portal({
  roles,
  colorMap,
}: {
  roles: Nullish<RoleData[]>;
  colorMap: RoleColorMap;
}) {
  return (
    <Select.Portal>
      <Select.Content className={css.content}>
        <Select.Viewport>
          {roles?.map((role) => (
            <Item
              key={role.id}
              name={role.name}
              color={colorMap.get(role.name)}
            />
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
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
        <Select.ItemText>{capitalize(name)}</Select.ItemText>
      </Select.Item>
    </Text>
  );
}
