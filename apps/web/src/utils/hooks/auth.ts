"use client";
import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Returns a memoized callback that when called performs a logout on the client. */
export function useSignOut() {
  const supabase = createClient();
  const router = useRouter();

  return useCallback(() => {
    return supabase.auth.signOut().then(() => router.push("/"));
  }, [supabase, router]);
}

/** Returns a memoized callback that when called enables OAuth login */
export function useSignIn(provider: Provider = "google") {
  const supabase = createClient();

  return useCallback(() => {
    return supabase.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: `${getURL()}auth/callback` },
    });
  }, [supabase]);
}

function getURL() {
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
