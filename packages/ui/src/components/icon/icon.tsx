import { ComponentProps } from "react";
import { MdAdd, MdSettings } from "react-icons/md";
import { Text } from "../text";
import { ICON_SIZES } from "./icon.utils";

interface IconBaseProps extends Omit<ComponentProps<"div">, "children"> {
  size?: keyof typeof ICON_SIZES;
  alt?: string;
}

export interface IconProps extends IconBaseProps {
  icon: React.ReactNode;
}

export function Custom({ icon, size = "md", alt, ...restProps }: IconProps) {
  return (
    <Text
      asChild
      data={{
        size: ICON_SIZES[size],
        lineHeight: 0,
      }}
      style={{
        position: "relative",
        width: ICON_SIZES[size],
        height: ICON_SIZES[size],
      }}
    >
      <i {...restProps} aria-label={alt} aria-hidden={alt == null}>
        {icon}
      </i>
    </Text>
  );
}

export function Add(props: IconBaseProps) {
  return <Custom icon={<MdAdd />} {...props} />;
}

export function Settings(props: IconBaseProps) {
  return <Custom icon={<MdSettings />} {...props} />;
}
