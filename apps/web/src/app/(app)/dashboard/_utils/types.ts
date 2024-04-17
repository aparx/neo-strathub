export interface DashboardParams {
  teamId: string;
  bookId: string;
}

export const DASHBOARD_QUERY_PARAMS = {
  document: "inspectDocument",
  query: "query",
} as const satisfies Readonly<Record<string, string>>;

export type DashboardQueryParams = typeof DASHBOARD_QUERY_PARAMS;

export type SharedContentProps = {
  documentId?: string;
} & (
  | {
      type: "team";
      teamId: string;
    }
  | {
      type: "book";
      teamId: string;
      bookId: string;
    }
  | {
      type: "overview";
    }
);
