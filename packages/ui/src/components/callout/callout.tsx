import { ComponentPropsWithoutRef } from "react";
import { MdInfoOutline } from "react-icons/md";
import { RiErrorWarningLine } from "react-icons/ri";
import { Flexbox } from "../flexbox";
import { Icon } from "../icon";
import { Text } from "../text";
import * as css from "./callout.css";
import { CalloutVariants } from "./callout.css";

type CalloutBaseProps = Omit<ComponentPropsWithoutRef<"div">, "color">;

export type CalloutProps = CalloutBaseProps &
  CalloutVariants & {
    icon: React.ReactNode;
  };

export function Custom({ icon, children, color, ...restProps }: CalloutProps) {
  return (
    <Flexbox
      asChild
      gap={"lg"}
      className={css.callout({ color })}
      {...restProps}
    >
      <Text type={"label"} size={"lg"}>
        <Icon.Custom icon={icon} />
        {children}
      </Text>
    </Flexbox>
  );
}

export function Warning(props: CalloutBaseProps) {
  return <Custom icon={<RiErrorWarningLine />} color={"warning"} {...props} />;
}

export function Info(props: CalloutBaseProps) {
  return <Custom icon={<MdInfoOutline />} color={"primary"} {...props} />;
}
