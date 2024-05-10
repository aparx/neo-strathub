"use client";
import { createClient } from "@/utils/supabase/client";
import { vars } from "@repo/theme";
import { Icon, Skeleton, Text } from "@repo/ui/components";
import { blendColors } from "@repo/ui/utils";
import { useQuery } from "@tanstack/react-query";
import { FiExternalLink } from "react-icons/fi";
import * as css from "./memberPlayerSlot.css";

export interface MemberPlayerSlotProps {
  memberId: number;
}

export function MemberPlayerSlot({ memberId }: MemberPlayerSlotProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["playerSlot", memberId],
    queryFn: async () =>
      await createClient()
        .from("player_slot_assign")
        .select("team_player_slot!inner(id, color, slot_index)")
        .eq("member_id", memberId)
        .maybeSingle(),
  });

  if (isLoading) return <Skeleton width={120} height={26} />;

  const slot = data?.data?.team_player_slot;
  const slotNumber = 1 + (slot?.slot_index ?? 0);
  return (
    <Text
      type={"label"}
      size={"md"}
      data={{ weight: 500 }}
      className={css.slot({ active: slot != null })}
      style={{
        color: slot ? slot.color : undefined,
        background: slot ? blendColors(slot.color, "black 80%") : undefined,
      }}
    >
      <Text
        type={"label"}
        size={"md"}
        data={{ weight: 700 }}
        className={css.number}
        style={{
          background: slot ? slot.color : vars.colors.accents[5],
          color: slot ? vars.colors.accents[0] : vars.colors.emphasis.low,
        }}
      >
        {slot ? slotNumber : "#"}
      </Text>
      {slot ? "Player" : "Assign slot"}
      <div className={css.arrow}>
        <Icon.Custom size={"sm"}>
          <FiExternalLink />
        </Icon.Custom>
      </div>
    </Text>
  );
}
