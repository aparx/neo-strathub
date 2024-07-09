import { useEditorContext } from "@/app/(app)/editor/[documentId]/_context";
import { useCallback } from "react";
import { EditorCommand } from "../../features/command";

export function usePushCommand() {
  const [editor] = useEditorContext();
  return useCallback(
    (command: EditorCommand) => {
      editor.history.push(command);
      editor.channel.broadcast(command.eventType, command.payload);
    },
    [editor],
  );
}
