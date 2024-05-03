"use server";
import { getProfile } from "@/modules/auth/actions";
import { AuthButton, UserField } from "@/modules/auth/components";
import { Flexbox, Icon, IconButton, Popover } from "@repo/ui/components";
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
          <Popover.Item>
            <Icon.Mapped type={"settings"} />
            Preferences
          </Popover.Item>
          <AuthButton.SignOut asChild>
            <Popover.Item color={"destructive"}>
              <Icon.Mapped type={"leave"} />
              Sign out
            </Popover.Item>
          </AuthButton.SignOut>
        </Popover.Content>
      </Popover.Root>
    </Flexbox>
  );
}
