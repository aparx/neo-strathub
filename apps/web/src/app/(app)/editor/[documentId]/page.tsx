import { Spinner } from "@repo/ui/components";
import dynamic from "next/dynamic";
import * as css from "./page.css";

export default function EditorPage({
  params,
}: {
  params: { documentId: string };
}) {
  // Fetch initial data of the blueprint
  const blueprintId = params.documentId;

  return <Content />;
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
