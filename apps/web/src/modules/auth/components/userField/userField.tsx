import { Avatar, AvatarPresence } from "@/modules/auth/components";
import { Tables } from "@/utils/supabase/types";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./userField.css";

type UserFieldBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface UserFieldProps extends UserFieldBaseProps {
  profile: Pick<Tables<"profile">, "id" | "name" | "avatar">;
  /** @default "1.3em" */
  avatarSize?: string;
  presence?: AvatarPresence;
}

/**
 * A component that represents a user by displaying their avatar and name
 * semantically next to each other.
 *
 * @param id
 * @param profile
 * @param avatarSize
 * @param restProps
 * @constructor
 */
export function UserField({
  id,
  profile,
  presence,
  avatarSize = "1.3em",
  ...restProps
}: UserFieldProps) {
  return (
    <figure
      data-user-id={id}
      className={css.field({ presence })}
      {...restProps}
    >
      <Avatar size={avatarSize} src={profile.avatar} presence={presence} />
      <figcaption>{profile.name ?? "(Deleted)"}</figcaption>
    </figure>
  );
}
