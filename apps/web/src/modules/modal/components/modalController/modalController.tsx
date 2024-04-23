"use client";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { isModalPageKey, MODAL_PAGES } from "@/modules/modal/modals";
import { useURL } from "@/utils/hooks";
import { Modal } from "@repo/ui/components";
import { useRouter, useSearchParams } from "next/navigation";

export function ModalController() {
  const router = useRouter();
  const newUrl = useURL();
  const searchParams = useSearchParams();

  const modalType = searchParams.get(DASHBOARD_QUERY_PARAMS.modal);
  if (!isModalPageKey(modalType)) return null;

  const PageModalContent = MODAL_PAGES[modalType];
  newUrl.searchParams.delete(DASHBOARD_QUERY_PARAMS.modal);

  const onClose = () => router.replace(newUrl.href, { scroll: false });

  return (
    <Modal.Root open={true} onOpenChange={(open) => !open && onClose()}>
      <PageModalContent />
    </Modal.Root>
  );
}
