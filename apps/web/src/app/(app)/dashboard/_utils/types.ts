export interface DashboardParams {
  teamId: string;
  bookId: string;
}

export const DASHBOARD_QUERY_PARAMS = {
  document: "documentId",
} as const satisfies Readonly<Record<string, string>>;

export type DashboardQueryParams = typeof DASHBOARD_QUERY_PARAMS;