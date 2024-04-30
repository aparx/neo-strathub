import { Avatar } from "@/modules/auth/components";
import { Tables } from "@/utils/supabase/types";
import { ComponentPropsWithoutRef } from "react";
import * as css from "./userField.css";

type UserFieldBaseProps = Omit<ComponentPropsWithoutRef<"div">, "children">;

export interface UserFieldProps extends UserFieldBaseProps {
  profile: Pick<Tables<"profile">, "id" | "username" | "avatar">;
}

export function UserField({ profile, ...restProps }: UserFieldProps) {
  return (
    <figure className={css.field} {...restProps}>
      <Avatar size={"1.3em"} src={profile.avatar} />
      <figcaption>{profile.username ?? "(Deleted)"}</figcaption>
    </figure>
  );
}
