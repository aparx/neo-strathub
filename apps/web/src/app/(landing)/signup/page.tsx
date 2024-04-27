import * as css from "@/app/(landing)/signup/page.css";
import { SignupNameForm } from "@/app/(landing)/signup/partial/signup.nameForm";
import { getUser } from "@/modules/auth/actions";
import logo from "@assets/logo.svg";
import { vars } from "@repo/theme";
import { Icon, Text } from "@repo/ui/components";
import { cookies } from "next/headers";
import Image from "next/image";
import { IoMdLogIn } from "react-icons/io";

export default async function SignupPage() {
  const user = await getUser(cookies());
  if (!user) throw new Error("Implementation following"); // TODO
  return (
    <div className={css.shell}>
      <Text type={"title"} size={"lg"} className={css.shellTitle}>
        <Image src={logo} alt={"Logo"} height={16} />
        STRATHUB.GG
      </Text>
      <main className={css.modal}>
        <Text asChild type={"title"}>
          <header className={css.header}>
            <Icon.Custom icon={<IoMdLogIn />} />
            Finish your signup
          </header>
        </Text>
        <Text type={"label"} size={"lg"}>
          Hey,{" "}
          <span style={{ color: vars.colors.emphasis.medium }}>
            {user?.email}
          </span>
          !
        </Text>
        <SignupNameForm user={user} />
      </main>
    </div>
  );
}
