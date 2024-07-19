import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useReducer, useRef } from "react";
import { CanvasNodeConfig } from "utils";
import { usePutIntoTransformer } from "../../hooks";
import { TransformerContainer } from "../../transformers/container";
import { BasicTransformer, BasicTransformerProps } from "../basicTransformer";

export interface DefaultTransformerProps<
  T extends CanvasNodeConfig = CanvasNodeConfig,
> extends BasicTransformerProps {
  show: boolean;
  config: T;
  link: Konva.Node | undefined;
  children?: React.ReactNode;
}

export const DefaultTransformer = forwardRef<
  Konva.Transformer,
  DefaultTransformerProps
>(function DefaultTransformer(
  { shown, link, children, config, ...restProps },
  ref,
) {
  const trRef = useRef<Konva.Transformer>(null);
  usePutIntoTransformer(shown, trRef.current, link);

  //* A call forces React to rerender this component which is wanted to
  //* update the position of the tooltip implicitly. THIS IS ONLY TEMPORARY.
  const [, forceUpdate] = useReducer((x) => 1 + x, 0);

  const parent = link?.parent;
  if (!link || !parent) return null;

  return (
    <TransformerContainer.Root config={config} linked={link}>
      <BasicTransformer
        ref={mergeRefs(trRef, ref)}
        onDragMove={forceUpdate}
        onTransform={forceUpdate}
        {...restProps}
      />
      {shown && (
        <TransformerContainer.Tooltip>{children}</TransformerContainer.Tooltip>
      )}
    </TransformerContainer.Root>
  );
});
