import { Spinner } from "@repo/ui/components";
import dynamic from "next/dynamic";
import * as css from "./page.css";

export default dynamic(async () => (await import("./content")).EditorContent, {
  loading: () => <FullPageEditorSpinner />,
  ssr: false,
});

export function FullPageEditorSpinner() {
  return (
    <div className={css.loadingContainer}>
      <Spinner size={"2em"} />
    </div>
  );
}
