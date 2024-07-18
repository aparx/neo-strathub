import { CanvasNodeConfig } from "@repo/canvas";
import { vars } from "@repo/theme";
import { Flexbox } from "@repo/ui/components";
import Konva from "konva";
import { Dispatch, forwardRef, SetStateAction } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useEditorEventHandler } from "../features/events";
import { BaseTransformer, BaseTransformerData } from "./baseTransformer";
import * as TooltipItem from "./tooltipItems";

export interface RectangleTransformerProps
  extends BaseTransformerData<CanvasNodeConfig> {
  onUpdateConfig: Dispatch<SetStateAction<CanvasNodeConfig>>;
}

/** The debounce time until a *specific* config field update is committed */
const CONFIG_FIELD_DEBOUNCE_MS = 500;

export const RectangleTransformer = forwardRef<
  Konva.Transformer,
  RectangleTransformerProps
>(function RectangleTransformer({ config, onUpdateConfig, ...restProps }, ref) {
  const eventHandler = useEditorEventHandler();
  const debounceUpdateFields = useDebouncedCallback(
    (updatedFields: Partial<CanvasNodeConfig>) => {
      eventHandler.fire("canvasUpdate", "user", {
        fields: { [config.id]: updatedFields },
      });
    },
    CONFIG_FIELD_DEBOUNCE_MS,
  );

  const items = [
    <TooltipItem.Color
      key="fillColor"
      color={config.fill}
      onChange={(newColor) => {
        onUpdateConfig((old) => {
          debounceUpdateFields({ fill: newColor });
          return { ...old, fill: newColor };
        });
      }}
    />,
    <TooltipItem.Duplicate key="duplicate" />,
    <TooltipItem.Copy key="copy" />,
    <TooltipItem.Delete key="delete" />,
  ] as const;

  return (
    <BaseTransformer ref={ref} config={config} {...restProps}>
      <Flexbox asChild gap="sm" style={{ marginLeft: vars.spacing.xs }}>
        <ul aria-label="Tools" style={{ listStyle: "none" }}>
          {items.map((item) => item && <li key={item.key}>{item}</li>)}
        </ul>
      </Flexbox>
    </BaseTransformer>
  );
});
