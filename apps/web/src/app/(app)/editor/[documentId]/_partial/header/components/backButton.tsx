"use client";
import { Icon, IconButton } from "@repo/ui/components";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <IconButton onClick={() => router.back()}>
      <Icon.Mapped type={"back"} />
    </IconButton>
  );
}
