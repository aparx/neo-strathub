import { Slot as RadixSlot } from "@radix-ui/react-slot";
import { Text } from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./settingField.css";

export type SettingFieldProps = ComponentPropsWithoutRef<"label">;

export function Root({ className, ...restProps }: SettingFieldProps) {
  return (
    <Text asChild>
      <label className={mergeClassNames(className, css.field)} {...restProps} />
    </Text>
  );
}

export interface SettingFieldSlotProps extends ComponentPropsWithoutRef<"div"> {
  asChild?: boolean;
}

export function Slot({
  asChild,
  className,
  ...restProps
}: SettingFieldSlotProps) {
  const Component = asChild ? RadixSlot : "div";
  return (
    <Component
      className={mergeClassNames(className, css.slot)}
      {...restProps}
    />
  );
}
