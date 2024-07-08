import { vars } from "@repo/theme";
import { Popover, PopoverItem, Text } from "@repo/ui/components";
import { useEffect, useRef } from "react";
import { BiZoomIn, BiZoomOut } from "react-icons/bi";
import { TbZoomReset } from "react-icons/tb";
import { useEditorContext } from "../../../../_context";
import { EditorConfig } from "../../../../_utils";

export function ZoomButton() {
  const [{ scale, updateScale }] = useEditorContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const roundScale = Math.round(100 * scale);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = String(roundScale);
  }, [roundScale]);

  return (
    <Popover.Root>
      <Popover.Expand style={{ color: vars.colors.emphasis.medium }}>
        <Text data={{ font: "mono" }}>{roundScale}%</Text>
      </Popover.Expand>
      <Popover.Content>
        <PopoverItem.Field.Root size="compact">
          %
          <PopoverItem.Field.Input
            ref={inputRef}
            type="number"
            defaultValue={roundScale}
            placeholder={String(roundScale)}
            max={100 * EditorConfig.MAX_ZOOM_SCALE}
            min={100 * EditorConfig.MIN_ZOOM_SCALE}
            onChange={(e) =>
              e.target.value && updateScale(() => Number(e.target.value) / 100)
            }
          />
        </PopoverItem.Field.Root>
        <PopoverItem.Divider />
        <PopoverItem.Button
          size="compact"
          onClick={() => updateScale((old) => old + 0.05)}
        >
          <BiZoomIn />
          Zoom in
        </PopoverItem.Button>
        <PopoverItem.Button
          size="compact"
          onClick={() => updateScale((old) => old - 0.05)}
        >
          <BiZoomOut />
          Zoom out
        </PopoverItem.Button>
        <PopoverItem.Divider />
        <PopoverItem.Button size="compact" onClick={() => updateScale(() => 1)}>
          <TbZoomReset />
          Reset Zoom
        </PopoverItem.Button>
      </Popover.Content>
    </Popover.Root>
  );
}
