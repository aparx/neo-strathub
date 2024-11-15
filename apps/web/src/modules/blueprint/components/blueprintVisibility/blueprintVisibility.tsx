import { vars } from "@repo/theme";
import { Icon, Tooltip } from "@repo/ui/components";
import { MdLinkOff, MdLockOpen, MdLockOutline } from "react-icons/md";

type VisibilityKey = "public" | "private" | "unlisted"; // Maybe move to different loc.

export const VISIBILITY_COLOR_MAP = {
  public: vars.colors.warning.base,
  private: vars.colors.primary.base,
  unlisted: vars.colors.emphasis.low,
} as const satisfies Record<VisibilityKey, string>;

const iconMap = {
  public: <MdLockOpen />,
  private: <MdLockOutline />,
  unlisted: <MdLinkOff />,
} as const satisfies Record<VisibilityKey, React.ReactNode>;

export interface BlueprintVisibilityProps
  extends Omit<Icon.IconProps, "children"> {
  type: keyof typeof iconMap;
}

export function BlueprintVisibility({
  type,
  alt = `Visibility: ${type}`,
  ...restProps
}: BlueprintVisibilityProps) {
  const color = VISIBILITY_COLOR_MAP[type];

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span style={{ color, lineHeight: 0 }}>
            <Icon.Custom alt={alt} {...restProps}>
              {iconMap[type]}
            </Icon.Custom>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Content style={{ color }}>{type}</Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
