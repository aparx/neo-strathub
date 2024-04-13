import { ComponentPropsWithoutRef } from "react";
import { MdInfo, MdWarning } from "react-icons/md";
import { Flexbox } from "../flexbox";
import { Text } from "../text";
import * as css from "./callout.css";
import { CalloutVariants } from "./callout.css";

type CalloutBaseProps = Omit<ComponentPropsWithoutRef<"div">, "color">;

export type CalloutProps = CalloutBaseProps &
  CalloutVariants & {
    icon: React.ReactNode;
  };

export function Base({ icon, children, color, ...restProps }: CalloutProps) {
  return (
    <Flexbox
      asChild
      gap={"lg"}
      className={css.callout({ color })}
      {...restProps}
    >
      <Text type={"label"} size={"lg"}>
        {icon}
        {children}
      </Text>
    </Flexbox>
  );
}

export function Warning(props: CalloutBaseProps) {
  return <Base icon={<MdWarning />} color={"warning"} {...props} />;
}

export function Information(props: CalloutBaseProps) {
  return <Base icon={<MdInfo />} color={"secondary"} {...props} />;
}
