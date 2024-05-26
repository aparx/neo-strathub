import * as css from "@/app/(landing)/signup/page.css";
import { SignupNameForm } from "@/app/(landing)/signup/partial/signup.nameForm";
import { getUser } from "@/modules/auth/actions";
import Logo from "@assets/logo.svg";
import { vars } from "@repo/theme";
import { Callout, Flexbox, Text } from "@repo/ui/components";
import { pascalCase } from "@repo/utils";
import { cookies } from "next/headers";

export default async function SignupPage() {
  const user = await getUser(cookies());
  if (!user) throw new Error("Implementation following"); // TODO
  return (
    <div className={css.shell}>
      <Text
        type={"title"}
        size={"lg"}
        data={{ weight: 700 }}
        className={css.shellTitle}
      >
        <Logo height={16} />
        STRATHUB.GG
      </Text>
      <Flexbox orient={"vertical"} gap={"md"}>
        <main className={css.modal}>
          <Text asChild type={"title"}>
            <header className={css.header}>Complete your profile</header>
          </Text>
          <Text style={{ color: vars.colors.emphasis.medium }}>
            Hey {pascalCase(user.user_metadata.name)}! Before you can begin your
            strategic journey, you need to choose a unique username first.
          </Text>
          <SignupNameForm user={user} />
        </main>
        <Callout.Warning>
          Note: This application is still in active development!
        </Callout.Warning>
      </Flexbox>
    </div>
  );
}
