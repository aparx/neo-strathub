import { getCenter, rotateAroundPoint } from "@/utils/canvas";
import { TransformerContainer } from "@repo/canvas";
import { Icon, IconButton, IconButtonProps } from "@repo/ui/components";
import { MdRotateRight } from "react-icons/md";
import { useOverlayItemContext } from "./provider";

export type RotateProps = Partial<IconButtonProps>;

export function Rotate({ onClick, ...restProps }: RotateProps) {
  const { config } = TransformerContainer.useTransformerContainer();
  const { handler } = useOverlayItemContext();

  return (
    <IconButton
      aria-label="Copy"
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        handler.fire("canvasUpdate", "user", {
          fields: {
            [config.id]: rotateAroundPoint(config, 45, getCenter(config)),
          },
        });
      }}
      {...restProps}
      {...restProps}
    >
      <Icon.Custom>
        <MdRotateRight />
      </Icon.Custom>
    </IconButton>
  );
}
