import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { DefaultTransformer, TransformerContainer } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Flexbox, Icon, IconButton } from "@repo/ui/components";
import { Nullish } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useEffect, useState } from "react";
import { FaLink, FaLinkSlash } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { useEditorEventHandler } from "../features/events";
import { useEditorEvent } from "../features/events/hooks";
import { GameObjectConfig } from "./gameObject";
import * as OverlayItem from "./items";

export interface GameObjectTransformerProps {
  shown: boolean;
  link: Konva.Node | Nullish;
  config: GameObjectConfig;
}

const ROTATE_KEYS: string[] = ["AltLeft"] as const;

export const GameObjectTransformer = forwardRef<
  Konva.Transformer,
  GameObjectTransformerProps
>(function GameObjectTransformer({ shown, link, config }, ref) {
  const [editor] = useEditorContext();
  const eventHandler = useEditorEventHandler();
  const [rotate, setRotate] = useState(false);

  useEditorEvent("keyPress", (e) => {
    if (ROTATE_KEYS.includes(e.event.code)) setRotate(true);
  });

  useEditorEvent("keyRelease", (e) => {
    if (ROTATE_KEYS.includes(e.event.code)) setRotate(false);
  });

  return (
    <DefaultTransformer
      ref={ref}
      keepRatio
      link={link}
      config={config}
      shown={!rotate && shown}
      rotateEnabled={rotate}
    >
      <OverlayItem.ContextProvider handler={eventHandler} editor={editor}>
        <MainItemList {...config} />
        <OverlayItem.Slot />
      </OverlayItem.ContextProvider>
    </DefaultTransformer>
  );
});

function MainItemList({ objectType }: GameObjectConfig) {
  const items = [
    objectType === "character" && <LinkItem key="link" />,
    <OverlayItem.Duplicate key="duplicate" />,
    <OverlayItem.Copy key="copy" />,
    <OverlayItem.Replace key="replace" />,
    <OverlayItem.Delete key="delete" />,
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
  const { handler } = OverlayItem.useOverlayItemContext();
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
