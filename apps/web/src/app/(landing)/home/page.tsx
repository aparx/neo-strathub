import { AuthButton } from "@/modules/auth/components";
import { Flexbox, Text } from "@repo/ui/components";

export default async function Page() {
  return (
    <div>
      <Text type={"title"} size={"sm"}>
        Strathub Demo
      </Text>
      <Flexbox gap={"md"}>
        <AuthButton.SignIn>Login</AuthButton.SignIn>
      </Flexbox>
    </div>
  );
}
