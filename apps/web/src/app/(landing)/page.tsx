import { vars } from "@repo/theme";
import "@repo/theme/css";
import { Flexbox } from "@repo/ui/components";

export default function Page() {
  return (
    <div>
      Strathub Demo
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
