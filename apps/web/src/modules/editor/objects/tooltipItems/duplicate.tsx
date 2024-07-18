import { TransformerContainer } from "@repo/canvas";
import { Icon, IconButton, IconButtonProps } from "@repo/ui/components";
import { useOverlayItemContext } from "./provider";

export type DuplicateProps = Partial<IconButtonProps>;

export function Duplicate({ onClick, ...restProps }: DuplicateProps) {
  const { config } = TransformerContainer.useTransformerContainer();
  const { handler } = useOverlayItemContext();

  return (
    <IconButton
      aria-label="Duplicate"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented)
          handler.fire("canvasDuplicate", "user", {
            targets: [config.id],
          });
      }}
      {...restProps}
    >
      <Icon.Mapped type="duplicate" />
    </IconButton>
  );
}
