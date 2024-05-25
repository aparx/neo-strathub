import { HelpButton } from "@/components";
import { UserField } from "@/modules/auth/components";
import { useUserContext } from "@/modules/auth/context";
import { TeamMemberFlags, hasFlag } from "@/modules/auth/flags";
import { UseGetTeamFromParamsResultData } from "@/modules/modal/hooks";
import {
  PlayerSlotTrigger,
  ROLE_SELECT_HEIGHT,
  RemoveMemberButton,
  RoleSelect,
  RoleSelectProps,
} from "@/modules/team/modals/members/components";
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
import { Nullish } from "@repo/utils";
import moment from "moment";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import * as css from "./content.css";
import {
  SlotContextProvider,
  SlotContextSlot,
  useSlotContext,
} from "./context";
import { TeamMemberData, useGetMembers } from "./hooks";
import { SelectSlotModal, SlotSwapModal } from "./modals";

function sortMembers(members: Nullish<TeamMemberData[]>) {
  return members?.sort((a, b) => b.member_role.flags - a.member_role.flags);
}

export function TeamMembersModalContent(
  team: NonNullable<UseGetTeamFromParamsResultData>,
) {
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
        <SlotContextProvider teamId={team.id}>
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
        </SlotContextProvider>
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
      canModifyRole={canModify}
      canModifySlot={canModifyBase}
      canKick={canKick}
    />
  );
}

function MemberRow({
  member,
  canKick,
  canModifyRole,
  canModifySlot,
  onRemove,
  onUpdate,
}: {
  member: TeamMemberData;
  canKick?: boolean;
  canModifyRole?: boolean;
  canModifySlot?: boolean;
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
        <MemberSlotButton member={member} disabled={!canModifySlot} />
      </Table.Cell>
      <Table.Cell>
        <RoleSelect
          width={100}
          initialRoleId={role_id}
          onSelect={onUpdate}
          disabled={!canModifyRole}
        />
      </Table.Cell>
      <Table.Cell>{moment(created_at).format("YYYY-MM-DD HH:mm")}</Table.Cell>
      <Table.Cell>
        <RemoveMemberButton disabled={!canKick} onConfirm={onRemove}>
          <UserField
            profile={member.profile}
            style={{ color: vars.colors.emphasis.high }}
          />
        </RemoveMemberButton>
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
  const { data, isFetching, refetch } = useSlotContext();
  const [isPending, startTransition] = useTransition();
  const [rootOpen, setRootOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const newSlotRef = useRef<SlotContextSlot | null>(null);

  const slot = useMemo(
    () => data.state?.find((x) => x.members.find((y) => y.id === member.id)),
    [data?.state],
  );

  if (isFetching) return <Skeleton width={100} height={24} outline />;

  function doChangeSlot(mode: "stack" | "swap") {
    const slot = newSlotRef.current;
    startTransition(async () => {
      const { error } = await createClient().rpc("assign_member_to_slot", {
        member_id: member.id,
        slot_id: (slot?.id as NonNullable<(typeof slot & {})["id"]>) ?? null,
        try_swap: mode === "swap",
      });
      // TODO toasts?
      if (error) console.error("#_doChangeSlot", error);
      setRootOpen(false);
      // noinspection ES6MissingAwait
      refetch(); // <- this should finish outside the transition
    });
  }

  return (
    <Modal.Root open={rootOpen} onOpenChange={setRootOpen}>
      <Modal.Trigger asChild>
        <PlayerSlotTrigger slot={slot} disabled={disabled} />
      </Modal.Trigger>
      <SelectSlotModal
        member={member}
        isLoading={isPending}
        onSelect={(data) => {
          newSlotRef.current = data;
          if (!data?.members.length || !slot) doChangeSlot("stack");
          else if (!data?.members.find((x) => x.id === member.id))
            setSwapOpen(true);
          else setRootOpen(false);
        }}
      />
      {swapOpen && (
        <SlotSwapModal
          open={true}
          onOpenChange={setSwapOpen}
          onSwap={doChangeSlot}
        />
      )}
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
