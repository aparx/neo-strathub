import {
  isModalPageKey,
  MODAL_PAGES,
} from "@/app/(app)/dashboard/@modal/modals";
import { DASHBOARD_QUERY_PARAMS } from "@/app/(app)/dashboard/_utils";
import { PageModalRoot } from "../_components";

export default function ModalPage({
  params,
  searchParams,
}: {
  params: Record<string, string>;
  searchParams: Partial<Record<string, string>>;
}) {
  const modalType = searchParams[DASHBOARD_QUERY_PARAMS.modal];
  if (!isModalPageKey(modalType)) return null;
  const PageModalContent = MODAL_PAGES[modalType];

  return (
    <PageModalRoot>
      <PageModalContent params={params} searchParams={searchParams} />
    </PageModalRoot>
  );
}
