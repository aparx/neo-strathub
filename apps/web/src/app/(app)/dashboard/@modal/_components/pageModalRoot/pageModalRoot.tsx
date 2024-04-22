"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { useURL } from "@/utils/hooks";
import { Modal } from "@repo/ui/components";
import { useRouter } from "next/navigation";

export function PageModalRoot({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const newUrl = useURL();
  newUrl.searchParams.delete(DASHBOARD_QUERY_PARAMS.modal);

  return (
    <Modal.Root
      defaultOpen={true}
      onOpenChange={(s) => !s && router.replace(newUrl.href, { scroll: false })}
    >
      {children}
    </Modal.Root>
  );
}
