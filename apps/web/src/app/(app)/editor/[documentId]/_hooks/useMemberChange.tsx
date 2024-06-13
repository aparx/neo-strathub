import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

/**
 * Hooks into `postgres_changes` on team member updates (`DELETE` and `UPDATE`).
 */
export function useMemberChange(memberId: number) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel("team-member-db-changes");
    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_member",
          filter: `id=eq.${memberId}`,
        },
        (payload) => {
          console.log(payload);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId]);
}
