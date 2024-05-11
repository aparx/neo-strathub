import { Enums } from "@/utils/supabase/types";
import { Text } from "@repo/ui/components";
import * as css from "./auditLogType.css";

export interface AuditLogTypeProps {
  type: Enums<"audit_log_type">;
}

export function AuditLogType({ type }: AuditLogTypeProps) {
  return (
    <Text type={"label"} className={css.container({ type })}>
      {type.toUpperCase()}
    </Text>
  );
}
