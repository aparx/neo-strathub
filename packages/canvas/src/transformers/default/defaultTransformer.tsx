import { mergeRefs } from "@repo/utils";
import Konva from "konva";
import { forwardRef, useRef, useState } from "react";
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

  const [verifiedShown, setVerifiedShown] = useState(true);
  const parent = link?.parent;
  if (!link || !parent) return null;

  return (
    <TransformerContainer.Root config={config} linked={link}>
      <BasicTransformer
        ref={mergeRefs(trRef, ref)}
        onDragStart={() => setVerifiedShown(false)}
        onDragEnd={() => setVerifiedShown(true)}
        onTransformStart={() => setVerifiedShown(false)}
        onTransformEnd={() => setVerifiedShown(true)}
        {...restProps}
      />
      {shown && verifiedShown && (
        <TransformerContainer.Overlay>{children}</TransformerContainer.Overlay>
      )}
    </TransformerContainer.Root>
  );
});
