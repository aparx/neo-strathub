import { PostgrestResponse } from "@supabase/supabase-js";
import {
  InfiniteData,
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";

type NarrowData<T> = NonNullable<T extends any[] ? T[number] : T>;

export type GetUseQueryData<TQueryResult> =
  TQueryResult extends UseInfiniteQueryResult<infer TData>
    ? NarrowData<InferPostgrestData<UnwrapInfiniteData<TData>>>
    : TQueryResult extends UseQueryResult<infer TData>
      ? NarrowData<InferPostgrestData<TData>>
      : never;

type InferPostgrestData<TData> =
  TData extends PostgrestResponse<any> ? TData["data"] : TData;

type UnwrapInfiniteData<TRes> =
  TRes extends InfiniteData<any> ? TRes["pages"][number] : TRes;

/**
 * Utility type that infers the deepest return value of a function (`THook`),
 * if it is of type `UseQueryResult`, or more specifically
 * `UseQueryResult<PostgrestResponse<...>>`.
 *
 * @example
 *   const useGetSomeArray = () => useQuery({
 *     queryKey: ["someKey"],
 *     queryFn: async () => ["Hello", "World"] as const,
 *   })
 *
 *   type T = DeepInferUseQueryResult<typeof useGetSomeArray>;
 *   //   ^? "Hello" | "World"
 */
export type DeepInferUseQueryResult<THook extends (...args: any[]) => any> =
  THook extends (...args: any[]) => infer TReturn
    ? TReturn extends Promise<infer TInner>
      ? GetUseQueryData<TInner>
      : GetUseQueryData<TReturn>
    : never;
