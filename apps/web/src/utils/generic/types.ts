import { PostgrestResponse } from "@supabase/supabase-js";
import { UseQueryResult } from "@tanstack/react-query";

export type GetUseQueryPostgrestResult<TQueryResult> =
  TQueryResult extends UseQueryResult<PostgrestResponse<infer TDeepData>>
    ? TDeepData extends any[]
      ? TDeepData[number]
      : TDeepData
    : TQueryResult extends UseQueryResult<infer TCloseData>
      ? TCloseData extends any[]
        ? TCloseData[number]
        : TCloseData
      : never;

/**
 * Utility type that infers the deepest return value of a function (`THook`),
 * if it is of type `UseQueryResult`, or more specifically
 * `UseQueryResult<PostgrestResponse<...>>`.
 *
 * @example
 *   const useGetTeam = () => useQuery({
 *     queryKey: ["someKey"],
 *     queryFn: async () => ["Hello", "World"] as const,
 *   })
 *
 *   type T = DeepInferUseQueryResult<typeof useGetTeam>;
 *   //   ^? "Hello" | "World"
 */
export type DeepInferUseQueryResult<THook extends (...args: any[]) => any> =
  THook extends (...args: any[]) => infer TReturn
    ? TReturn extends Promise<infer TInner>
      ? GetUseQueryPostgrestResult<TInner>
      : GetUseQueryPostgrestResult<TReturn>
    : never;
