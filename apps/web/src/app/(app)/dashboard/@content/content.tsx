import { DashColumn } from "@/app/(app)/dashboard/_components";

export function DashContent() {
  return (
    <DashColumn.Root>
      <DashColumn.Header style={{ borderLeft: "unset", borderRight: "unset" }}>
        Content
      </DashColumn.Header>
      <DashColumn.Content style={{ borderLeft: "unset" }}>
        List of blueprints
        <ol>
          {new Array(100).fill(
            <li>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo
              dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet.
            </li>,
          )}
        </ol>
      </DashColumn.Content>
    </DashColumn.Root>
  );
}
