"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { isModalPageKey, MODAL_PAGES } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import { Modal } from "@repo/ui/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ModalController() {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const newUrl = useURL();

  // To match SSR we set opened to true after first rerender
  useEffect(() => setOpened(true), []);

  const searchParams = useSearchParams();
  const modalType = searchParams.get(DASHBOARD_QUERY_PARAMS.modal);
  if (!isModalPageKey(modalType)) return null;

  const PageModalContent = MODAL_PAGES[modalType];

  newUrl.searchParams.delete(DASHBOARD_QUERY_PARAMS.modal);

  const onClose = () => router.replace(newUrl.href, { scroll: false });

  return (
    <Modal.Root open={opened} onOpenChange={(open) => !open && onClose()}>
      <PageModalContent />
    </Modal.Root>
  );
}
