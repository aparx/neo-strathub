import Konva from "konva";
import { forwardRef, useState } from "react";
import { Html, Portal } from "react-konva-utils";
import { useCanvas } from "../../context";
import { BasicTransformer } from "../basicTransformer";
import * as css from "./defaultTransformer.css";

export interface DefaultTransformerProps extends Konva.TransformerConfig {
  show: boolean;
  link: Konva.Node | undefined;
  children?: React.ReactNode;
}

export const DefaultTransformer = forwardRef<
  Konva.Transformer,
  DefaultTransformerProps
>(function DefaultTransformer({ shown, link, children, ...restProps }, ref) {
  const [internalShow, setInternalShow] = useState(true);
  const canvas = useCanvas();
  const parent = link?.parent;
  if (!link || !parent) return null;

  const linkRect = link.getClientRect({
    relativeTo: parent,
  });

  const posX = linkRect.x + parent.x();
  const posY = linkRect.y + parent.y();
  const inverseScale = 1 / canvas.scale.state;

  return (
    <Portal selector=".selection-layer">
      <BasicTransformer
        ref={ref}
        onDragStart={() => setInternalShow(false)}
        onDragEnd={() => setInternalShow(true)}
        onTransformStart={() => setInternalShow(false)}
        onTransformEnd={() => setInternalShow(true)}
        {...restProps}
      />
      {shown && internalShow && (
        <Html
          divProps={{
            style: {
              position: "absolute",
              left: 0,
              bottom: 0,
            },
          }}
        >
          <div
            className={css.overlay}
            style={{
              left: `max(calc(${posX}px + ${linkRect.width / 2}px), 0px)`,
              top: posY - (css.OVERLAY_HEIGHT + 5) * inverseScale,
              scale: inverseScale,
              transform: "translateX(-50%)",
            }}
          >
            {children}
          </div>
        </Html>
      )}
    </Portal>
  );
});
