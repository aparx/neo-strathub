import { Dispatch, SetStateAction, useMemo, useState } from "react";

export interface SharedState<S> {
  state: S;
  update: Dispatch<SetStateAction<S>>;
}

export function useSharedState<S>(initial?: S | (() => S)): SharedState<S> {
  const [state, setState] = useState<S>(initial as S | (() => S));
  return useMemo(() => ({ state, update: setState }), [state, setState]);
}
