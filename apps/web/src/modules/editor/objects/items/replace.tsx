import { Icon, IconButton, IconButtonProps } from "@repo/ui/components";
import { TbReplace } from "react-icons/tb";

export type ReplaceProps = Partial<IconButtonProps>;

export function Replace(props: ReplaceProps) {
  return (
    <IconButton aria-label="Replace" {...props}>
      <Icon.Custom>
        <TbReplace />
      </Icon.Custom>
    </IconButton>
  );
}
