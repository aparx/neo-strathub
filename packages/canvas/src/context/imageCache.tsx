"use client";
import { Nullish } from "@repo/utils";
import { SharedState, useSharedState } from "@repo/utils/hooks";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export interface CanvasImageCache {
  retrieve: (
    key: string,
    loader: (push: (image: HTMLImageElement) => void) => void,
  ) => HTMLImageElement | Nullish;
}

const SIZE_SYMBOL = Symbol("size");

export interface CanvasImageCacheMap {
  [cacheKey: string]: HTMLImageElement | null;
  [SIZE_SYMBOL]: number;
}

const cacheContext = createContext<SharedState<CanvasImageCache> | null>(null);

export function CanvasImageCacheProvider({
  children,
  maxCacheSize = 25,
}: {
  children: React.ReactNode;
  maxCacheSize?: number;
}) {
  const queueRef = useRef(new Set<string>());
  const [cache, setCache] = useState<CanvasImageCacheMap>();
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  const retrieve = useCallback<CanvasImageCache["retrieve"]>(
    (key, loader) => {
      const image = cacheRef.current?.[key];
      if (image) return image; // Image is cached
      if (queueRef.current.has(key)) return image;
      queueRef.current.add(key);
      loader((image) => {
        queueRef.current.delete(key);
        setCache((oldCache) => {
          let size = oldCache?.[SIZE_SYMBOL] ?? 0;
          if (size > maxCacheSize) {
            //* Purge cache
            size = 0;
            oldCache = { [SIZE_SYMBOL]: size };
          }
          return {
            ...oldCache,
            [key]: image,
            [SIZE_SYMBOL]: 1 + size,
          };
        });
      });
      return null;
    },
    [setCache, maxCacheSize],
  );

  const context = useSharedState<CanvasImageCache>({ retrieve });

  return (
    <cacheContext.Provider value={context}>{children}</cacheContext.Provider>
  );
}

export function useCanvasImageCache(): [
  CanvasImageCache,
  Dispatch<SetStateAction<CanvasImageCache>>,
] {
  const ctx = useContext(cacheContext);
  if (!ctx) throw new Error("Missing CanvasImageCache context");
  return [ctx.state, ctx.update];
}

export function useCanvasImage(imageURL: string) {
  const [cache] = useCanvasImageCache();
  return cache.retrieve(imageURL, (push) => {
    const image = new Image();
    image.src = imageURL;
    image.onload = () => push(image);
  });
}
