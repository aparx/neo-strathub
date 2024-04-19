"use client";
import { getURL } from "@/utils/generic";
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
