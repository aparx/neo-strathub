import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { CanvasContext } from "@repo/canvas";
import { RefObject, useCallback } from "react";
import { z } from "zod";
import { useEditorEventHandler } from "./events";

const clipboardSchema = z.object({
  origin: z.object({
    blueprintId: z.string(),
    arenaId: z.number(),
    gameId: z.number(),
  }),
  /** Stages that contains a record of levels that contain nodes */
  stages: z.record(
    z.coerce.number(),
    z.record(z.coerce.number(), z.any().array()),
  ),
});

type ClipboardData = z.infer<typeof clipboardSchema>;

export function useCopyNodes(canvas: RefObject<CanvasContext>) {
  const eventHandler = useEditorEventHandler();
  const [editor] = useEditorContext();

  return useCallback(() => {
    const data: ClipboardData = {
      origin: {
        blueprintId: editor.blueprint.id,
        arenaId: editor.blueprint.arena.id,
        gameId: editor.blueprint.arena.game_id,
      },
      stages: {},
    };
    eventHandler.fire("canvasCopy", "user", {
      targets: canvas.current?.selected.state ?? [],
      copyNodes: (stage, level, nodes) => {
        const stageData = data.stages[stage] ?? {};
        const levelData = stageData[level] ?? [];
        levelData.push(...nodes);
        stageData[level] = levelData;
        data.stages[stage] = stageData;
      },
    });
    navigator.clipboard.writeText(JSON.stringify(data));
  }, [eventHandler, editor, canvas]);
}

export function usePasteNodes(canvas: RefObject<CanvasContext>) {
  const eventHandler = useEditorEventHandler();
  const [editor] = useEditorContext();

  return useCallback(async () => {
    const { success, data, error } = await navigator.clipboard
      .readText()
      .then(JSON.parse)
      .then(clipboardSchema.safeParse);
    if (!success) return console.error("Could not paste data", error.errors);
    if (data.origin.gameId !== editor.blueprint.arena.game_id)
      throw new Error("Copied content is for a different game");
    if (data.origin.arenaId !== editor.blueprint.arena.id)
      // TODO this is only temporary: remove it sooner or later
      throw new Error("Copied content is for a different arena");
    const rootNode = canvas.current?.canvas.current;
    if (!rootNode) throw new Error("Canvas has not been created yet");
    Object.keys(data.stages).forEach((stageKey) => {
      const stageId = Number(stageKey);
      const stage = data.stages[stageId];
      if (!stage) return;
      //* - If the blueprint is equal:
      //    a. If multiple stages are selected, re-paste into given stages
      //    b. If a single stage is selected, paste into the currently selected
      //* - If the blueprint is unequal:
      //    a. (!) If multiple stages are selected, throw an error
      //    b. If a single stage is selected, paste into the currently selected
      //* - If the data origin arena ID equals the current arena ID:
      //    a. If multiple levels are copied, paste into the same levels
      //    b. If a single level is copied, paste into focused level
      //* - If the data origin arena ID not equals the current arena ID:
      //    a. If multiple levels are copied, find substitutes in same order
      //    b. If a single level is copied, paste into focused level
      const levelKeys = Object.keys(stage);
      levelKeys.forEach((levelKey) => {
        const levelId = Number(levelKey);
        const level = stage[levelId];
        if (!level?.length) return;

        if (data.origin.arenaId === editor.blueprint.arena.id) {
          // Copy data as expected
        }
      });
    });
  }, []);
}
