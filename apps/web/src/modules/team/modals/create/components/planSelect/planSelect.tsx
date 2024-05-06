"use client";
import { formatCurrency } from "@/utils/generic";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
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

type PlanSelectBaseProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "role"
>;

export interface PlanSelectProps extends PlanSelectBaseProps {
  name: string;
  required?: boolean;
}

export function PlanSelect({
  name,
  required,
  className,
  ...restProps
}: PlanSelectProps) {
  const [selected, setSelected] = useState<number>();
  const { data, isLoading } = useGetPlans();

  useEffect(() => {
    // Update the initial selected to the default plan (if existing)
    if (!data?.data || selected != null) return;
    setSelected(data?.data?.find((x) => x.is_default)?.id);
  }, [data]);

  if (isLoading)
    return <Skeleton width={"100%"} height={132} outline roundness={"md"} />;

  return (
    <div
      role={"radiogroup"}
      className={mergeClassNames(css.group, className)}
      aria-required={required}
      {...restProps}
    >
      {data?.data?.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          radioName={name}
          selected={selected === plan.id}
          onSelect={() => setSelected(plan.id)}
          required
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
  required,
}: {
  plan: Plan;
  radioName: string;
  selected?: boolean;
  onSelect?: () => any;
  required?: boolean;
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
          required={required}
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
