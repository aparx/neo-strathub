"use client";
import { formatCurrency } from "@/utils/generic";
import { DeepInferUseQueryResult } from "@/utils/generic/types";
import { createClient } from "@/utils/supabase/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Skeleton } from "@repo/ui/components";
import { useQuery } from "@tanstack/react-query";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import * as css from "./planSelect.css";

function useGetPlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: async () => createClient().from("plan").select(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}

type PlanData = DeepInferUseQueryResult<typeof useGetPlans>;

export function PlanSelect<TFieldValues extends FieldValues>({
  defaultValue,
  ...restProps
}: Omit<UseControllerProps<TFieldValues>, "defaultValue"> & {
  defaultValue: (
    defaultId: number | undefined,
  ) => UseControllerProps<TFieldValues>["defaultValue"];
}) {
  const { data, isLoading } = useGetPlans();
  if (isLoading || !data?.data?.length)
    return <Skeleton width={"100%"} height={132} />;

  return (
    <Controller
      {...restProps}
      render={({ field }) => <PlanGroup plans={data.data} {...field} />}
      defaultValue={defaultValue(data?.data?.find((x) => x.is_default)?.id)}
    />
  );
}

interface PlanSelectSharedInputProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => any;
}

interface PlanGroupProps extends PlanSelectSharedInputProps {
  plans: PlanData[];
  onChange?: (newValue: number) => void;
  value?: number;
}

function PlanGroup({ plans, onChange, value, ...inputProps }: PlanGroupProps) {
  return (
    <div role={"radiogroup"} className={css.group}>
      {plans.map((plan) => (
        <PlanOption
          plan={plan}
          checked={value === plan.id}
          onSelect={() => onChange?.(plan.id)}
          {...inputProps}
        />
      ))}
    </div>
  );
}

interface PlanOptionProps extends PlanSelectSharedInputProps {
  plan: PlanData;
  checked: boolean;
  onSelect?: () => any;
}

function PlanOption({
  plan,
  checked,
  onSelect,
  ...inputProps
}: PlanOptionProps) {
  return (
    <label data-plan-id={plan.id} className={css.label({ selected: checked })}>
      <VisuallyHidden asChild>
        <input
          type={"radio"}
          value={plan.id}
          checked={checked}
          onChange={(e) => e.currentTarget.value && onSelect?.()}
          {...inputProps}
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
