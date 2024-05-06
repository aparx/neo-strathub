"use client";
import { formatCurrency } from "@/utils/generic";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@repo/ui/components";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import * as css from "./planSelect.css";

function useGetPlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => createClient().from("plan").select(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}

type Plan = DeepInferUseQueryResult<typeof useGetPlans>;

export function PlanSelect() {
  const [selected, setSelected] = useState<number>();
  const { data, isLoading } = useGetPlans();

  useEffect(() => {
    // Update the initial selected to the default plan (if existing)
    if (!data?.data || selected != null) return;
    setSelected(data?.data?.find((x) => x.is_default)?.id);
  }, [data]);

  if (isLoading) return <Skeleton width={"100%"} height={30} />;

  return (
    <div
      role={"radiogroup"}
      aria-required={true}
      aria-label={"Choose a plan"}
      className={css.group}
    >
      {data?.data?.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          radioName={"planId"}
          selected={selected === plan.id}
          onSelect={() => setSelected(plan.id)}
        />
      ))}
    </div>
  );
}

function PlanCard({
  plan,
  radioName,
  selected,
  onSelect,
}: {
  plan: Plan;
  radioName: string;
  selected?: boolean;
  onSelect?: () => any;
}) {
  return (
    <label data-plan-id={plan.id} className={css.label({ selected })}>
      <VisuallyHidden asChild>
        <input
          type={"radio"}
          value={plan.id}
          name={radioName}
          checked={selected}
          onChange={(e) => e.target.checked && onSelect?.()}
          required
        />
      </VisuallyHidden>
      <h6>{plan.name}</h6>
      <span>
        {!plan.pricing
          ? "Free"
          : `${formatCurrency(plan.pricing)} / ${plan.pricing_interval}`}
      </span>
    </label>
  );
}
