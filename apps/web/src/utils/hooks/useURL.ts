import { getURL } from "@/utils/generic";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Hook that returns the current absolute URL.
 */
export function useURL(): URL {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const baseUrl = getURL();
  return useMemo(() => {
    const url = new URL(baseUrl);
    url.pathname = pathname;
    searchParams.forEach((val, key) => url.searchParams.set(key, val));
    return url;
  }, [baseUrl, pathname, searchParams]);
}
