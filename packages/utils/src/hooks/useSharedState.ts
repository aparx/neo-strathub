import { Dispatch, SetStateAction, useState } from "react";

export interface SharedState<S> {
  state: S;
  update: Dispatch<SetStateAction<S>>;
}

export function useSharedState<S>(initial?: S | (() => S)): SharedState<S> {
  const [state, setState] = useState<S>(initial as S | (() => S));
  return { state, update: setState };
}
