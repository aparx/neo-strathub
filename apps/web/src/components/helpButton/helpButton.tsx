import { Icon, Tooltip } from "@repo/ui/components";
import { mergeClassNames } from "@repo/utils";
import { ComponentPropsWithoutRef } from "react";
import { MdHelp } from "react-icons/md";
import * as css from "./helpButton.css";

export function Root(props: Tooltip.TooltipRootProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root {...props} />
    </Tooltip.Provider>
  );
}

export type HelpButtonTriggerProps = Omit<
  ComponentPropsWithoutRef<"button">,
  "disabled" | "children"
>;

export function Trigger({ className, ...restProps }: HelpButtonTriggerProps) {
  return (
    <Tooltip.Trigger asChild>
      <button
        className={mergeClassNames(className, css.trigger)}
        {...restProps}
      >
        <Icon.Custom size={"sm"}>
          <MdHelp />
        </Icon.Custom>
      </button>
    </Tooltip.Trigger>
  );
}

export function Content({
  className,
  children,
  ...restProps
}: ComponentPropsWithoutRef<"div">) {
  return (
    <Tooltip.Content
      className={mergeClassNames(className, css.content)}
      {...restProps}
    >
      {children}
    </Tooltip.Content>
  );
}
