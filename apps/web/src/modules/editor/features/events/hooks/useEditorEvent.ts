import { useCallback, useEffect, useRef } from "react";
import {
  EditorEventCallback,
  EditorEventUnsubscribeFn,
  useEditorEventHandler,
} from "../editorEventHandler";
import { EditorEventType } from "../editorEventMap";

export function useEditorEvent<const TType extends EditorEventType>(
  type: TType,
  callback: EditorEventCallback<TType>,
): EditorEventUnsubscribeFn {
  const eventHandler = useEditorEventHandler();
  const unsubscribeRef = useRef<EditorEventUnsubscribeFn>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const invoke = useCallback<EditorEventCallback<TType>>((...args) => {
    callbackRef.current?.(...args);
  }, []);

  useEffect(() => {
    const unsubscribe = eventHandler.subscribe(type, invoke);
    unsubscribeRef.current = unsubscribe;
    return () => {
      unsubscribe();
    };
  }, [invoke]);

  return () => unsubscribeRef.current?.() ?? false;
}
