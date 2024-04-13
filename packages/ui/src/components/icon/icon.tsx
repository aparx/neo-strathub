import { ComponentProps } from "react";
import { IoMdEye } from "react-icons/io";
import { MdAdd, MdEdit, MdSearch, MdSettings } from "react-icons/md";
import { Text } from "../text";
import { ICON_SIZES } from "./icon.utils";

export interface IconBaseProps extends Omit<ComponentProps<"div">, "children"> {
  size?: keyof typeof ICON_SIZES;
  alt?: string;
}

export interface IconProps extends IconBaseProps {
  icon: React.ReactNode;
}

export function Custom({ icon, size = "md", alt, ...restProps }: IconProps) {
  return (
    <Text asChild data={{ size: ICON_SIZES[size], lineHeight: 0 }}>
      <i {...restProps} aria-label={alt} aria-hidden={alt == null}>
        {icon}
      </i>
    </Text>
  );
}

const ICON_MAP = {
  add: <MdAdd />,
  settings: <MdSettings />,
  search: <MdSearch />,
  preview: <IoMdEye />,
  edit: <MdEdit />,
} as const satisfies Record<string, React.ReactNode>;

export function Mapped({
  type,
  ...restProps
}: IconBaseProps & {
  type: keyof typeof ICON_MAP;
}) {
  return <Custom icon={ICON_MAP[type]} {...restProps} />;
}
