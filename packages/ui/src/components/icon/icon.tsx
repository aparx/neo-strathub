import { HTMLAttributes } from "react";
import { Text } from "../text";
import { ICON_SIZES } from "./icon.utils";

type IconBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

export interface IconProps extends IconBaseProps {
  icon: React.ReactNode;
  /** @default "md" */
  size?: keyof typeof ICON_SIZES;
}

export function Icon({ icon, size = "md", ...restProps }: IconProps) {
  return (
    <Text asChild data={{ size: ICON_SIZES[size], lineHeight: 1 }}>
      <i {...restProps}>{icon}</i>
    </Text>
  );
}
