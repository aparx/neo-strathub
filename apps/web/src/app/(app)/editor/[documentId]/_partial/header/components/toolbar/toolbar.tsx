import { useEditorEventHandler } from "@/modules/editor/features/events";
import { Flexbox, Icon, IconButton } from "@repo/ui/components";

export function Toolbar() {
  const eventHandler = useEditorEventHandler();

  return (
    <Flexbox asChild gap="sm">
      <ul
        aria-label="Tools"
        style={{ padding: "unset", margin: "unset", listStyle: "none" }}
      >
        <li>
          <IconButton
            aria-label="Undo"
            onClick={() => eventHandler.fire("editorUndo", "user", {})}
          >
            <Icon.Mapped type="undo" />
          </IconButton>
        </li>
        <li>
          <IconButton
            aria-label="Redo"
            onClick={() => eventHandler.fire("editorRedo", "user", {})}
          >
            <Icon.Mapped type="redo" />
          </IconButton>
        </li>
      </ul>
    </Flexbox>
  );
}
