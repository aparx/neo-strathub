"use client";
import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { TeamMembersModalContent } from "@/modules/team/modals/members/content";
import { Spinner } from "@repo/ui/components";

export function TeamMembersModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return <TeamMembersModalContent {...data} />;
}
