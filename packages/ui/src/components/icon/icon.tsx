import { ComponentPropsWithoutRef } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgNotes } from "react-icons/cg";
import { IoMdBook, IoMdEye } from "react-icons/io";
import {
  MdAdd,
  MdAlternateEmail,
  MdArrowBack,
  MdArrowForward,
  MdArrowUpward,
  MdClose,
  MdDelete,
  MdEdit,
  MdMoreVert,
  MdOutlineDriveFileRenameOutline,
  MdPeople,
  MdSearch,
  MdSettings,
  MdTag,
} from "react-icons/md";
import { RiExpandUpDownLine, RiFilterFill, RiFilterLine } from "react-icons/ri";
import { Text } from "../text";
import { ICON_SIZES } from "./icon.utils";

export interface IconProps extends ComponentPropsWithoutRef<"div"> {
  size?: keyof typeof ICON_SIZES;
  alt?: string;
}

export function Custom({
  children,
  size = "md",
  alt,
  ...restProps
}: IconProps) {
  return (
    <Text asChild data={{ size: ICON_SIZES[size], lineHeight: 0 }}>
      <i {...restProps} aria-label={alt} aria-hidden={alt == null}>
        {children}
      </i>
    </Text>
  );
}

const iconMap = {
  add: <MdAdd />,
  close: <MdClose />,
  settings: <MdSettings />,
  log: <CgNotes />,
  rename: <MdOutlineDriveFileRenameOutline />,
  details: <MdMoreVert />,
  members: <MdPeople />,
  leave: <BiLogOut />,
  delete: <MdDelete />,
  filterEmpty: <RiFilterLine />,
  filterFull: <RiFilterFill />,
  search: <MdSearch />,
  preview: <IoMdEye />,
  edit: <MdEdit />,
  upgrade: <MdArrowUpward />,
  tag: <MdTag />,
  name: <MdAlternateEmail />,
  back: <MdArrowBack />,
  next: <MdArrowForward />,
  expand: <RiExpandUpDownLine />,
  book: <IoMdBook />,
} as const satisfies Record<string, React.ReactNode>;

export function Mapped({
  type,
  ...restProps
}: IconProps & {
  type: keyof typeof iconMap;
}) {
  return <Custom {...restProps}>{iconMap[type]}</Custom>;
}
