export interface DashboardParams {
  teamId: string;
  bookId: string;
}

export const DASHBOARD_QUERY_PARAMS = {
  document: "inspectDocument",
  book: "bookId",
  query: "query",
} as const satisfies Readonly<Record<string, string>>;

export type DashboardQueryParams = typeof DASHBOARD_QUERY_PARAMS;

export interface BaseContentPathProps {
  teamId?: string;
  bookId?: string;
}

export interface ExtendedContentPathProps extends BaseContentPathProps {
  documentId?: string;
}
