import { createClient } from "@/utils/supabase/client";
import { CanvasNode } from "@repo/canvas";

export async function saveNode(node: CanvasNode) {
  // TODO broadcast node update
  await createClient()
    .from("blueprint_object")
    .update({
      attributes: node.attrs,
      classname: node.className,
    })
    .eq("id", node.attrs.id);
}
