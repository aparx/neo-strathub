import { getServiceServer } from "@/utils/supabase/actions";
import { Spinner } from "@repo/ui/components";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import * as css from "./page.css";

export default async function EditorEditPage({
  params,
  searchParams,
}: {
  params: { documentId: string };
  searchParams: { stage?: number };
}) {
  // TODO replace with anon server & define what stage is to be seen
  const qb = getServiceServer(cookies())
    .from("blueprint_stage")
    .select("id")
    .eq("blueprint_id", params.documentId)
    .order("index")
    .limit(1);
  if (searchParams.stage != null) qb.eq("index", searchParams.stage);
  const stageQuery = await qb.single().throwOnError();

  // Get the stage of the blueprint
  if (!stageQuery.data) throw new Error("Could not find stage");
  return <EditorWindow stageId={stageQuery.data.id} />;
}

const EditorWindow = dynamic(
  async () => (await import("./window")).EditorEditContent,
  {
    loading: () => <FullPageEditorSpinner />,
    ssr: false,
  },
);

// TODO this needs to be moved to a separate component, to be exported
export function FullPageEditorSpinner() {
  return (
    <div className={css.loadingContainer}>
      <Spinner size={"2em"} />
    </div>
  );
}
