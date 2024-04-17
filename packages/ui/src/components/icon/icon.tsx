import { ComponentProps } from "react";
import { BiLogOut } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import {
  MdAdd,
  MdArrowBack,
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdOutlineDriveFileRenameOutline,
  MdPeople,
  MdSearch,
  MdSettings,
} from "react-icons/md";
import { RiFilterFill, RiFilterLine } from "react-icons/ri";
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

const iconMap = {
  add: <MdAdd />,
  settings: <MdSettings />,
  rename: <MdOutlineDriveFileRenameOutline />,
  details: <MdMoreVert />,
  members: <MdPeople />,
  back: <MdArrowBack />,
  leave: <BiLogOut />,
  delete: <MdDelete />,
  filterEmpty: <RiFilterLine />,
  filterFull: <RiFilterFill />,
  search: <MdSearch />,
  preview: <IoMdEye />,
  edit: <MdEdit />,
} as const satisfies Record<string, React.ReactNode>;

export function Mapped({
  type,
  ...restProps
}: IconBaseProps & {
  type: keyof typeof iconMap;
}) {
  return <Custom icon={iconMap[type]} {...restProps} />;
}
