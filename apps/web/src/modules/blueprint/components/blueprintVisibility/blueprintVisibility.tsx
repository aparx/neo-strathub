import { vars } from "@repo/theme";
import { Icon } from "@repo/ui/components";
import { MdLinkOff, MdLockOpen, MdLockOutline } from "react-icons/md";

const iconMap = {
  public: <MdLockOpen color={vars.colors.warning.base} />,
  private: <MdLockOutline color={vars.colors.primary.base} />,
  unlisted: <MdLinkOff color={vars.colors.emphasis.low} />,
} as const satisfies Record<string, React.ReactNode>;

export interface BlueprintVisibilityProps extends Icon.IconBaseProps {
  type: keyof typeof iconMap;
}

export function BlueprintVisibility({
  type,
  alt = `Visibility: ${type}`,
  ...restProps
}: BlueprintVisibilityProps) {
  return <Icon.Custom icon={iconMap[type]} alt={alt} {...restProps} />;
}
