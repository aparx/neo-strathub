import Konva from "konva";
import { forwardRef, useState } from "react";
import { CanvasNodeConfig } from "utils";
import { TransformerContainer } from "../../transformers/container";
import { BasicTransformer } from "../basicTransformer";

export interface DefaultTransformerProps extends Konva.TransformerConfig {
  show: boolean;
  config: CanvasNodeConfig;
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
  const [verifiedShown, setVerifiedShown] = useState(true);
  const parent = link?.parent;
  if (!link || !parent) return null;

  return (
    <TransformerContainer.Root config={config} linked={link}>
      <BasicTransformer
        ref={ref}
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
