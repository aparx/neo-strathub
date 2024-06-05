import { createClient } from "@/utils/supabase/client";
import { CanvasNode } from "@repo/canvas";

export async function upsertNodes(
  nodes: CanvasNode[],
  levelId: number,
  stageId: number,
) {
  // TODO broadcast node update
  return createClient()
    .from("blueprint_object")
    .upsert(
      nodes.map((node) => ({
        id: node.attrs.id,
        classname: node.className,
        attributes: node.attrs,
        level_id: levelId,
        stage_id: stageId,
      })),
    )
    .throwOnError();
}

export async function deleteNodes(ids: string[]) {
  return createClient()
    .from("blueprint_object")
    .delete()
    .in("id", ids)
    .throwOnError();
}