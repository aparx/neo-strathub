import { createClient } from "@/utils/supabase/client";
import {
  CanvasNodeData,
  CHARACTER_ID_ATTRIBUTE,
  OBJECT_ID_ATTRIBUTE,
} from "@repo/canvas";

export async function addObject(
  stageId: number,
  levelId: number,
  node: CanvasNodeData,
) {
  // TODO broadcast?
  return createClient()
    .from("blueprint_object")
    .insert({
      id: node.attrs.id,
      stage_id: stageId,
      level_id: levelId,
      character_id: getNumberAttrFromNode(CHARACTER_ID_ATTRIBUTE, node),
      classname: node.className,
      attributes: node.attrs,
    });
}

export async function updateObject(node: CanvasNodeData) {
  // TODO broadcast?
  return createClient()
    .from("blueprint_object")
    .update({
      attributes: node.attrs,
      classname: node.className,
      character_id: getNumberAttrFromNode(CHARACTER_ID_ATTRIBUTE, node),
      object_id: getNumberAttrFromNode(OBJECT_ID_ATTRIBUTE, node),
    })
    .eq("id", node.attrs.id);
}

export async function deleteObject(stageId: number, id: string) {
  return createClient()
    .from("blueprint_object")
    .delete()
    .eq("id", id)
    .eq("stage_id", stageId);
}

function getNumberAttrFromNode(key: string, node: CanvasNodeData) {
  const attr = node.attrs[key];
  if (attr == null) return null;
  return Number(attr);
}
