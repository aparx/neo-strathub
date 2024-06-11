import { getServiceServer } from "@/utils/supabase/actions";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

export default async function EditorEditPage({
  params,
}: {
  params: { documentId: string };
}) {
  // TODO replace with anon server & define what stage is to be seen
  const stageQuery = await getServiceServer(cookies())
    .from("blueprint_stage")
    .select("id")
    .eq("blueprint_id", params.documentId)
    .throwOnError();

  // Get the stage of the blueprint
  if (!stageQuery.data) throw new Error("Could not find stage");
  return <EditorWindow stageIds={stageQuery.data.map((x) => x.id)} />;
}

const EditorWindow = dynamic(
  async () => (await import("./window")).EditorPreviewWindow,
  {
    ssr: false,
  },
);
