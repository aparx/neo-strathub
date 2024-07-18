import { Icon, IconButton, IconButtonProps } from "@repo/ui/components";

export type CopyProps = Partial<IconButtonProps>;

export function Copy(props: CopyProps) {
  return (
    <IconButton aria-label="Copy" {...props}>
      <Icon.Mapped type="copy" />
    </IconButton>
  );
}
