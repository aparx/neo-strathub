import { HelpButton } from "@/components";
import { UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { getTeam } from "@/modules/team/actions";
import {
  PlayerSlotTrigger,
  ROLE_SELECT_HEIGHT,
  RemoveMemberButton,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
import {
  MemberSlotData,
  TeamMemberData,
  useGetMembers,
} from "@/modules/team/modals/members/hooks";
import { AssignSlotModal } from "@/modules/team/modals/members/modals";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/utils/supabase/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { vars } from "@repo/theme";
import {
  Breadcrumbs,
  Flexbox,
  Modal,
  Skeleton,
  Table,
} from "@repo/ui/components";
import { InferAsync, Nullish } from "@repo/utils";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import * as css from "./content.css";

interface TeamMembersModalProps {
  team: NonNullable<InferAsync<ReturnType<typeof getTeam>>["data"]>;
}

function sortMembers(members: Nullish<TeamMemberData[]>) {
  return members?.sort((a, b) => {
    return b.member_role.flags - a.member_role.flags;
  });
}

export function TeamMembersModalContent({ team }: TeamMembersModalProps) {
  const { user } = useUserContext();
  const { isLoading, data, refetch } = useGetMembers(team.id);

  const [members, setMembers] = useState(data?.data);

  useEffect(() => setMembers(sortMembers(data?.data)), [data?.data]);

  const removeMember = useCallback(async (member: TeamMemberData) => {
    // Optimistic update, remove the actions first
    setMembers((current) => {
      const newMembers = current ? [...current] : [];
      const index = newMembers.indexOf(member);
      if (index != null) newMembers.splice(index, 1);
      return newMembers;
    });

    const { error } = await createClient().rpc("kick_member", {
      member_id: member.id,
    });
    if (error) {
      console.error("#_removeMember", error);
      // Refetch to ensure displayed data synchronicity and authenticity
      refetch().then(({ data }) => setMembers(sortMembers(data?.data)));
    }
  }, []);

  const updateRole = useCallback(
    async (target: TeamMemberData, role: Tables<"member_role">) => {
      await createClient().rpc("update_member_role", {
        team_id: target.team_id,
        new_role_id: role.id,
        target_profile_id: target.profile_id,
      });
    },
    [],
  );

  const self = useMemo(
    () => members?.find((x) => x.profile_id === user?.id),
    [members],
  );

  return (
    <Modal.Content minWidth={700}>
      <Modal.Title>
        <Breadcrumbs>
          {team.name}
          Members
        </Breadcrumbs>
        <Modal.Exit />
      </Modal.Title>

      <Table.Root className={css.table}>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>User</Table.HeadCell>
            <Table.HeadCell style={{ position: "relative" }}>
              <Flexbox align={"center"}>
                Slot
                <HelpButton.Root>
                  <HelpButton.Trigger />
                  <HelpButton.Content>
                    A player slot is a slot to which multiple members of a team
                    can be assigned and colored, so that they can be used in
                    blueprints. It makes swapping players very easy.
                  </HelpButton.Content>
                </HelpButton.Root>
              </Flexbox>
            </Table.HeadCell>
            <Table.HeadCell>Role</Table.HeadCell>
            <Table.HeadCell>Join date</Table.HeadCell>
            <Table.HeadCell>
              <VisuallyHidden>Remove</VisuallyHidden>
            </Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <MemberRowSkeleton key={index} />
              ))
            : null}
          {members?.map((member) => (
            <MemberSlot
              key={member.profile_id}
              member={member}
              onRemove={() => removeMember(member)}
              onUpdate={(newRole) => updateRole(member, newRole)}
              self={self}
            />
          ))}
        </Table.Body>
      </Table.Root>
    </Modal.Content>
  );
}

function MemberSlot({
  member,
  self,
  onRemove,
  onUpdate,
}: {
  member: TeamMemberData;
  /** The user themselves as a actions, can be null when they are site admins */
  self: Nullish<TeamMemberData>;
  onRemove: () => any;
  onUpdate: RoleSelectProps["onSelect"];
}) {
  const isUserThemselves = self?.profile_id === member.profile_id;
  const selfFlags = self?.member_role?.flags;
  const targetFlags = member.member_role?.flags;
  const canModifyBase = hasFlag(selfFlags, TeamMemberFlags.EDIT_MEMBERS);

  let canModify = canModifyBase;
  let canKick = hasFlag(selfFlags, TeamMemberFlags.KICK_MEMBERS);

  if (selfFlags && targetFlags) {
    // Only allow modification of members when they have lower prioritisation
    const isSelfPrioritized = selfFlags > targetFlags;
    canModify &&= isSelfPrioritized;
    canKick &&= isSelfPrioritized;
  } else {
    // Only allow modification of members when they are not the user themselves
    canModify &&= !isUserThemselves;
  }

  canKick ||= isUserThemselves;

  return (
    <MemberRow
      onRemove={onRemove}
      onUpdate={onUpdate}
      member={member}
      canModifySecurely={canModify}
      canModifyBasic={canModifyBase}
      canKick={canKick}
    />
  );
}

function MemberRow({
  member,
  canKick,
  canModifySecurely,
  canModifyBasic,
  onRemove,
  onUpdate,
}: {
  member: TeamMemberData;
  canKick?: boolean;
  canModifySecurely?: boolean;
  canModifyBasic?: boolean;
  onRemove: () => any;
  onUpdate: RoleSelectProps["onSelect"];
}) {
  const { created_at, role_id } = member;

  return (
    <Table.Row>
      <Table.Cell>
        <UserField profile={member.profile} />
      </Table.Cell>
      <Table.Cell>
        <MemberSlotButton member={member} disabled={!canModifyBasic} />
      </Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={100}
          initialRoleId={role_id}
          onSelect={onUpdate}
          disabled={!canModifySecurely}
        />
      </Table.Cell>
      <Table.Cell>{moment(created_at).format("YYYY-MM-DD HH:mm")}</Table.Cell>
      <Table.Cell>
        <RemoveMemberButton
          disabled={!canKick}
          onConfirm={onRemove}
          userField={
            <UserField
              profile={member.profile}
              style={{ color: vars.colors.emphasis.high }}
            />
          }
        />
      </Table.Cell>
    </Table.Row>
  );
}

function MemberSlotButton({
  member,
  disabled,
}: {
  member: TeamMemberData;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [rootOpen, setRootOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["playerSlot", member.id],
    queryFn: async () =>
      await createClient()
        .from("member_to_player_slot")
        .select("player_slot!inner(color, index)")
        .eq("member_id", member.id)
        .maybeSingle(),
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  const tmpSlot = data?.data?.player_slot;
  const [slot, setSlot] = useState<typeof tmpSlot | null>(tmpSlot);
  useEffect(() => setSlot(tmpSlot), [tmpSlot]);

  if (isLoading) return <Skeleton width={120} height={26} />;

  async function selectSlot(data: MemberSlotData | null) {
    // Optimistic update
    startTransition(async () => {
      setSlot(data ? { color: data.color, index: data.index } : null);
      const { error } = await createClient().rpc("assign_member_to_slot", {
        member_id: member.id,
        slot_id: (data?.id as NonNullable<(typeof data & {})["id"]>) ?? null,
        try_swap: false, // TODO SWAP MECHANIC THROUGH MODAL
      });
      setRootOpen(false);
      if (error) {
        console.error("#_selectSlot", error);
        refetch().then(({ data }) => setSlot(data?.data?.player_slot));
      }
    });
  }

  return (
    <Modal.Root open={rootOpen} onOpenChange={setRootOpen}>
      <Modal.Trigger asChild>
        <PlayerSlotTrigger slot={slot} disabled={disabled} />
      </Modal.Trigger>
      <AssignSlotModal
        member={member}
        onSelect={selectSlot}
        isLoading={isPending}
      />
    </Modal.Root>
  );
}

function MemberRowSkeleton() {
  return (
    <Table.Row>
      {Array.from({ length: 4 }, (_, i) => (
        <Table.Cell key={i}>
          <Skeleton height={ROLE_SELECT_HEIGHT} />
        </Table.Cell>
      ))}
    </Table.Row>
  );
}
