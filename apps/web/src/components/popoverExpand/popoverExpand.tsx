import { Icon, IconButton, Popover } from "@repo/ui/components";
import { MdExpandMore } from "react-icons/md";
import * as css from "./popoverExpand.css";

type PopoverExpandBaseProps = Omit<Popover.PopoverTriggerProps, "asChild">;

export interface PopoverExpandProps extends PopoverExpandBaseProps {
  /** If true, the button will fade-in, in a specific way */
  fadeIn?: boolean;
}

export function PopoverExpand({
  children,
  fadeIn,
  ...restProps
}: PopoverExpandProps) {
  return (
    <Popover.Trigger asChild {...restProps}>
      <IconButton className={css.buttonShell({ fadeIn })}>
        {children}
        <Icon.Custom className={css.buttonIcon({ fadeIn })}>
          <MdExpandMore />
        </Icon.Custom>
      </IconButton>
    </Popover.Trigger>
  );
}
