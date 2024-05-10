"use client";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { vars } from "@repo/theme";
import { Skeleton } from "@repo/ui/components";
import { createLineHeight } from "@repo/ui/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import * as css from "./gameSelect.css";

function useGetGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () =>
      await createClient().from("game").select("id, name, icon"),
  });
}

type GameData = DeepInferUseQueryResult<typeof useGetGames>;

export function GameSelect<TFieldValues extends FieldValues = FieldValues>({
  defaultValue,
  ...restProps
}: Omit<UseControllerProps<TFieldValues>, "defaultValue"> & {
  defaultValue: (
    defaultId: number | undefined,
  ) => UseControllerProps<TFieldValues>["defaultValue"];
}) {
  const { data, isLoading } = useGetGames();
  if (isLoading || !data?.data?.length)
    return <Skeleton width={"100%"} height={43} />;

  return (
    <Controller
      {...restProps}
      render={({ field }) => <GameGroup data={data.data} {...field} />}
      defaultValue={defaultValue(data.data[0]?.id)}
    />
  );
}

interface GameSelectSharedInputProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => any;
}

interface GameGroupProps extends GameSelectSharedInputProps {
  data: GameData[];
  onChange?: (newValue: number) => void;
  value?: number;
}

function GameGroup({
  data,
  onChange,
  value,
  disabled,
  required,
  ...inputProps
}: GameGroupProps) {
  return (
    <div
      role={"radiogroup"}
      className={css.group({ disabled })}
      aria-disabled={disabled}
      aria-required={required}
      style={{ display: data.length <= 1 ? "none" : undefined }}
    >
      {data?.map((game) => (
        <GameOption
          key={game.id}
          checked={value === game.id}
          game={game}
          onSelect={() => onChange?.(game.id)}
          disabled={disabled}
          required={required}
          {...inputProps}
        />
      ))}
    </div>
  );
}

interface GameOptionProps extends GameSelectSharedInputProps {
  game: GameData;
  checked: boolean;
  onSelect?: () => any;
}

function GameOption({
  game,
  checked,
  onSelect,
  ...inputProps
}: GameOptionProps) {
  const size = createLineHeight(vars.fontSizes.title.lg);

  return (
    <label className={css.option({ checked })}>
      <VisuallyHidden asChild>
        <input
          type={"radio"}
          value={game.id}
          checked={checked}
          onChange={(e) => e.currentTarget.checked && onSelect?.()}
          {...inputProps}
        />
      </VisuallyHidden>
      <div style={{ width: size, height: size, position: "relative" }}>
        <Image
          src={game.icon}
          alt={game.name}
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </label>
  );
}
