import { useGetTeamFromParams } from "@/modules/modal/hooks";
import { AuditLogModalContent } from "@/modules/team/modals/auditLog/content";
import { Spinner } from "@repo/ui/components";

export function AuditLogModal() {
  const { data, error } = useGetTeamFromParams();
  if (error) throw new Error(error);
  if (!data) return <Spinner />;

  return <AuditLogModalContent team={data} />;
}
