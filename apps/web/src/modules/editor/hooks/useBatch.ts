import { useCallback, useMemo, useRef } from "react";

type PushFn<T> = (data: T) => any;

export function useBatch<T>({
  commit,
  batchTime = 25,
  maxBatchSize = 20,
}: {
  commit: (data: T[]) => Promise<any>;
  /** Time in ms in which data is batched */
  batchTime?: number;
  /** If the accumulated data exceeds this, `commit` is executed immediately */
  maxBatchSize?: number;
}): PushFn<T> {
  const accumulateRef = useRef<T[]>([]);

  const timer = useBatchTimer(() => {
    if (!accumulateRef.current.length) return;
    // push commit the accumulated data (batch push)
    commit(accumulateRef.current);
    accumulateRef.current = [];
  }, batchTime);

  return useCallback(
    (data) => {
      // If first invocation, start timer that auto commits after
      if (!timer.running()) timer.start();
      accumulateRef.current.push(data);
      if (accumulateRef.current.length < maxBatchSize) return;
      // The max batch size is exceeded, immediately commit data
      timer.stop();
      commit(accumulateRef.current);
      accumulateRef.current = [];
    },
    [timer],
  );
}

function useBatchTimer(callback: () => any, ms: number) {
  const unsubscribeRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const invoke = useCallback(() => {
    unsubscribeRef.current = undefined;
    callbackRef.current();
  }, []);

  const stop = useCallback(() => {
    if (!unsubscribeRef.current) return;
    clearTimeout(unsubscribeRef.current);
    unsubscribeRef.current = undefined;
  }, []);

  const start = useCallback(() => {
    stop(); // stop any previous interval
    const unsubscribe = setTimeout(invoke, ms);
    unsubscribeRef.current = unsubscribe;
  }, [stop]);

  return useMemo(
    () => ({
      running: () => !!unsubscribeRef.current,
      start,
      stop,
    }),
    [start, stop],
  );
}
