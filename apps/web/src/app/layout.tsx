import { vars } from "@repo/theme";
import { Text } from "@repo/ui/components";
import type { Metadata } from "next";

import "@repo/theme/css";
import "./global.css";
import "./reset.css";

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" style={{ fontSize: "0.875rem" }}>
      <Text asChild>
        <body
          style={{
            background: vars.colors.accents[0],
            color: vars.colors.emphasis.high,
          }}
        >
          {children}
        </body>
      </Text>
    </html>
  );
}
