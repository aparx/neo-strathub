import { getBlueprint } from "@/modules/blueprint/actions/getBlueprint";
import { getServer, getServiceServer } from "@/utils/supabase/actions";
import { Spinner } from "@repo/ui/components";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import * as css from "./page.css";

export default async function EditorPage({
  params,
  searchParams,
}: {
  params: { documentId: string };
  searchParams: { stages?: string };
}) {
  const server = getServer(cookies());
  const stageIds = searchParams.stages
    ? (JSON.parse(searchParams.stages) as number[])
    : [];
  const blueprintId = params.documentId;

  const blueprintQuery = await getBlueprint(blueprintId);
  if (!blueprintQuery.data) throw new Error("Blueprint could not be found");
  const blueprint = blueprintQuery.data;

  // Get the stage of the blueprint
  // TODO replace service with anon
  const stageQuery = await getServiceServer(cookies())
    .from("blueprint_stage")
    .select("id")
    .eq("blueprint_id", blueprintId)
    .maybeSingle();

  if (!stageQuery.data) throw new Error("Could not find stage");

  // Check whether to display all stages at once

  return <Content blueprint={blueprint} stageId={stageQuery.data.id} />;
}

const Content = dynamic(async () => (await import("./content")).EditorContent, {
  loading: () => <FullPageEditorSpinner />,
  ssr: false,
});

// TODO this needs to be moved to a separate component, to be exported
export function FullPageEditorSpinner() {
  return (
    <div className={css.loadingContainer}>
      <Spinner size={"2em"} />
    </div>
  );
}
