export interface DashboardParams {
  teamId: string;
}

export const DASHBOARD_QUERY_PARAMS = {
  document: "inspectDocument",
  book: "bookId",
} as const satisfies Readonly<Record<string, string>>;

export interface BaseContentPathProps {
  teamId?: string;
  bookId?: string;
}

export interface ExtendedContentPathProps extends BaseContentPathProps {
  documentId?: string;
}
