import { GameObjectType } from "@/modules/gameObject/hooks";
import { TransformerContainer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Flexbox, Icon, IconButton } from "@repo/ui/components";
import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { BaseTransformer, BaseTransformerData } from "./baseTransformer";
import { GameObjectConfig } from "./gameObject";
import * as TooltipItem from "./tooltipItems";

export const GameObjectTransformer = forwardRef<
  Konva.Transformer,
  BaseTransformerData<GameObjectConfig>
>(function GameObjectTransformer({ config, ...restProps }, ref) {
  return (
    <BaseTransformer ref={ref} config={config} {...restProps}>
      <MainItemList objectType={config.objectType} />
    </BaseTransformer>
  );
});

function MainItemList({
  objectType,
}: Readonly<{
  objectType: GameObjectType;
}>) {
  const items = [
    objectType === "character" && <LinkItem key="link" />,
    <TooltipItem.Duplicate key="duplicate" />,
    <TooltipItem.Copy key="copy" />,
    <TooltipItem.Delete key="delete" />,
  ] as const;

  return (
    <Flexbox asChild gap="sm" style={{ marginLeft: vars.spacing.xs }}>
      <ul aria-label="Default Tools" style={{ listStyle: "none" }}>
        {items.map((item) => item && <li key={item.key}>{item}</li>)}
      </ul>
    </Flexbox>
  );
}

/**
 * Overlay-Item that enables the update the `linkToAssignee` value within a
 * game object configuration. The saving is debounced to save resources.
 */
function LinkItem() {
  const { handler } = TooltipItem.useOverlayItemContext();
  const { config } = TransformerContainer.useTransformerContainer();

  const [linked, setLinked] = useState<boolean | undefined>(false);
  useEffect(() => setLinked(config.linkToAssignee), [config.linkToAssignee]);

  // Link updates can be spammed; to avoid this debounce the event broadcast
  const fireLinkUpdate = useDebouncedCallback((val: boolean) => {
    handler.fire("canvasUpdate", "user", {
      fields: { [config.id]: { linkToAssignee: val } },
    });
  }, 200);

  return (
    <IconButton
      role="checkbox"
      aria-checked={linked}
      aria-label="linked"
      color={linked ? "primary" : "default"}
      disabled={!config.characterId}
      onClick={() =>
        setLinked((old) => {
          const newValue = !old;
          fireLinkUpdate(newValue);
          return newValue;
        })
      }
    >
      <Icon.Custom>{linked ? <FaLink /> : <FaLinkSlash />}</Icon.Custom>
    </IconButton>
  );
}
