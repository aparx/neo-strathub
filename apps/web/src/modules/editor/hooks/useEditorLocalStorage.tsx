import { useLocalStorage } from "usehooks-ts";

export function useEditorLocalStorage() {
  const [pos, savePos] = useLocalStorage("c_pos", { x: 0, y: 0 });
  const [scale, saveScale] = useLocalStorage("c_zoom", 1);

  return {
    position: {
      value: pos,
      save: savePos,
    },
    scale: {
      value: scale,
      save: saveScale,
    },
  } as const;
}
