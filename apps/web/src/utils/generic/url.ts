export function getURL() {
  // @ https://supabase.com/docs/guides/auth/concepts/redirect-urls
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
}

export function isIncludingURL(needle: URL, haystack: URL): boolean {
  if (needle.href === haystack.href) return true;
  // 1. Compare simple fields
  if (needle.name !== haystack.name) return false;
  if (needle.password !== haystack.password) return false;
  if (needle.host !== haystack.host) return false;
  if (needle.hostname !== haystack.hostname) return false;
  if (needle.protocol !== haystack.protocol) return false;
  if (needle.origin !== haystack.origin) return false;
  if (needle.port !== haystack.port) return false;
  if (needle.pathname !== haystack.pathname) return false;
  // 2. Compare if needle search params are elements of search params of haystack
  for (const [key, value] of needle.searchParams)
    if (haystack.searchParams.get(key) !== value) return false;
  return true;
}
