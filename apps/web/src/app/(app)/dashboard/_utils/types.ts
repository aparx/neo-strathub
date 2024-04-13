export interface DashboardParams {
  teamId: string;
  bookId: string;
}

export const DASHBOARD_QUERY_PARAMS = {
  document: "inspectDocument",
} as const satisfies Readonly<Record<string, string>>;

export type DashboardQueryParams = typeof DASHBOARD_QUERY_PARAMS;

export type SharedContentProps =
  | {
      type: "team";
      teamId: string;
    }
  | {
      type: "collection";
      teamId: string;
      bookId: string;
    }
  | {
      type: "overview";
    };
