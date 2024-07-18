import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import {
  CanvasNodeConfig,
  DefaultTransformer,
  DefaultTransformerProps,
} from "@repo/canvas";
import Konva from "konva";
import { forwardRef } from "react";
import { useEditorEventHandler } from "../features/events";
import * as OverlayItem from "./items";

export type BaseTransformerData<T extends CanvasNodeConfig> = Omit<
  DefaultTransformerProps<T>,
  "children"
>;

export type BaseTransformerProps<T extends CanvasNodeConfig> =
  DefaultTransformerProps<T>;

export const BaseTransformer = forwardRef<
  Konva.Transformer,
  BaseTransformerProps<CanvasNodeConfig>
>(function GameObjectTransformer(
  { shown, link, config, children, ...restProps },
  ref,
) {
  const [editor] = useEditorContext();
  const eventHandler = useEditorEventHandler();

  return (
    <DefaultTransformer
      ref={ref}
      keepRatio
      link={link}
      config={config}
      shown={shown}
      {...restProps}
    >
      <OverlayItem.ContextProvider handler={eventHandler} editor={editor}>
        {children}
        <OverlayItem.Slot />
      </OverlayItem.ContextProvider>
    </DefaultTransformer>
  );
});
