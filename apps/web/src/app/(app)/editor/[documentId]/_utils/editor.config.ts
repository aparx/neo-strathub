import { EditorStageStyle } from "@/modules/editor/components/stage";
import { CanvasLevelStyle } from "@repo/canvas";

export module EditorConfig {
  export const FOCUS_COLOR = [107, 185, 242] as const;

  export const LEVEL_STYLE = {
    width: 1200,
    height: 800,
    padding: 20,
    clipPadding: 10,
    focusStroke: `rgb(${FOCUS_COLOR.join(", ")})`,
    background: "rgb(225, 225, 225)",
  } as const satisfies CanvasLevelStyle;

  export const STAGE_STYLE = {
    levelGap: 50,
    levelDirection: [0, 1],
    levelStyle: LEVEL_STYLE,
  } as const satisfies EditorStageStyle;
}
