"use server";
import { getProfile } from "@/modules/auth/actions";
import { AuthButton, UserField } from "@/modules/auth/components";
import {
  Flexbox,
  Icon,
  IconButton,
  Popover,
  PopoverItem,
} from "@repo/ui/components";
import { cookies } from "next/headers";

export async function SelectorFooter() {
  const profile = await getProfile(cookies());

  return (
    <Flexbox justify={"space-between"} align={"center"}>
      {profile && <UserField profile={profile} avatarSize={"1.75em"} />}
      <Popover.Root>
        <Popover.Trigger asChild>
          <IconButton>
            <Icon.Mapped type={"details"} />
          </IconButton>
        </Popover.Trigger>
        <Popover.Content>
          <PopoverItem.Button>
            <Icon.Mapped type={"settings"} />
            Preferences
          </PopoverItem.Button>
          <AuthButton.SignOut asChild>
            <PopoverItem.Button color={"destructive"}>
              <Icon.Mapped type={"leave"} />
              Sign out
            </PopoverItem.Button>
          </AuthButton.SignOut>
        </Popover.Content>
      </Popover.Root>
    </Flexbox>
  );
}
