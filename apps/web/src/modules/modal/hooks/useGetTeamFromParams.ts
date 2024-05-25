import { ModalParameter } from "@/modules/modal/components/modalController/modalController.utils";
import { useTeam } from "@/modules/team/clientActions";
import { Nullish } from "@repo/utils";
import { useParams, useSearchParams } from "next/navigation";

export const USE_GET_TEAM_SEARCH_PARAM = ModalParameter.createToken("teamId");

/** If possible, returns the team based off of the route or search parameters. */
export function useGetTeamFromParams() {
  const searchParams = useSearchParams();
  let teamId: Nullish | string = useParams<{ teamId: string }>().teamId;
  if (teamId == null) teamId = searchParams.get(USE_GET_TEAM_SEARCH_PARAM);
  if (teamId == null) return { error: "Missing teamId", data: null };
  const { data, isLoading } = useTeam(teamId);
  if (isLoading) return { data: null, error: null };
  if (!data) return { data: null, error: "Could not find team" };
  return { data, error: null };
}

export type UseGetTeamFromParamsResultData = ReturnType<
  typeof useGetTeamFromParams
>["data"];
