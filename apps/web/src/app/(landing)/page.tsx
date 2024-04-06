import { vars } from "@repo/theme";
import "@repo/theme/css";
import { Flexbox, Text } from "@repo/ui/components";

export default function Page() {
  return (
    <div>
      <Text type={"title"} size={"sm"}>
        Strathub Demo
      </Text>
      <Flexbox
        dir={"vertical"}
        style={{
          background: vars.colors.primary.base,
          width: "max-content",
          padding: vars.spacing.lg,
        }}
      >
        <span>Hello</span>
        <span>World</span>
      </Flexbox>
    </div>
  );
}
