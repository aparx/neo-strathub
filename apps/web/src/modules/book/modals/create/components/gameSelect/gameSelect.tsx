"use client";

import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { vars } from "@repo/theme";
import { createLineHeight } from "@repo/ui/utils";
import { mergeClassNames } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import * as css from "./gameSelect.css";

type GameSelectBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface GameSelectProps extends GameSelectBaseProps {
  /** The name of each radio button */
  name: string;
}

function useGetGames() {
  return useQuery({
    queryKey: ["games"],
    queryFn: async () =>
      await createClient().from("game").select("id, name, icon"),
  });
}

type GameData = NonNullable<
  NonNullable<ReturnType<typeof useGetGames>["data"]>["data"]
>[number];

export function GameSelect({ className, name, ...restProps }: GameSelectProps) {
  const { data, isLoading } = useGetGames();
  const [active, setActive] = useState<number>();

  useEffect(() => {
    if (active == null)
      // Ensure a default active state
      setActive(data?.data?.[0]?.id);
  }, [data]);

  return (
    <div
      role={"radiogroup"}
      aria-required={true}
      className={mergeClassNames(className, css.group)}
      {...restProps}
    >
      {data?.data?.map((game) => (
        <GameOption
          checked={active === game.id}
          onChange={(checked) => checked && setActive(game.id)}
          radioName={name}
          {...game}
        />
      ))}
    </div>
  );
}

function GameOption({
  id,
  name,
  icon,
  checked,
  onChange,
  radioName,
}: GameData & {
  checked?: boolean;
  onChange?: (checked: boolean) => any;
  radioName: string;
}) {
  const size = createLineHeight(vars.fontSizes.title.lg);

  return (
    <label className={css.option({ checked })}>
      <VisuallyHidden asChild>
        <input
          type={"radio"}
          name={radioName}
          value={id}
          checked={checked}
          aria-checked={checked}
          onChange={(e) => onChange?.(e.target?.checked)}
        />
      </VisuallyHidden>
      <div style={{ width: size, height: size, position: "relative" }}>
        <Image src={icon} alt={name} fill style={{ objectFit: "contain" }} />
      </div>
    </label>
  );
}
