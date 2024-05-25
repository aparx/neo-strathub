"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { ModalParameter } from "@/modules/modal/components/modalController/modalController.utils";
import { isModalPageKey, MODAL_PAGES } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import { Modal } from "@repo/ui/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function ModalController() {
  const [opened, setOpened] = useState(false);
  const router = useRouter();
  const newURL = useURL();

  // To match SSR we set opened to true after first rerender
  useEffect(() => setOpened(true), []);

  const searchParams = useSearchParams();
  const modalType = searchParams.get(DASHBOARD_QUERY_PARAMS.modal);
  if (!isModalPageKey(modalType)) return null;

  const PageModalContent = MODAL_PAGES[modalType];

  // Delete all modal parameters from the new search params
  ModalParameter.deleteAll(newURL.searchParams);

  const onClose = () => router.replace(newURL.href, { scroll: false });

  return (
    <Modal.Root open={opened} onOpenChange={(open) => !open && onClose()}>
      <PageModalContent />
    </Modal.Root>
  );
}
