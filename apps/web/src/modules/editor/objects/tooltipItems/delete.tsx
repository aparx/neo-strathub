import { TransformerContainer } from "@repo/canvas";
import { Icon, IconButton, IconButtonProps } from "@repo/ui/components";
import { useOverlayItemContext } from "./provider";

export type DeleteProps = Partial<IconButtonProps>;

export function Delete({ onClick, ...restProps }: DeleteProps) {
  const { config } = TransformerContainer.useTransformerContainer();
  const { handler } = useOverlayItemContext();

  return (
    <IconButton
      color="destructive"
      aria-label="Delete"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented)
          handler.fire("canvasDelete", "user", {
            targets: [config.id],
          });
      }}
      {...restProps}
    >
      <Icon.Mapped type="delete" />
    </IconButton>
  );
}
