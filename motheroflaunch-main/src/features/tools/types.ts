export type CursorPaginatedResult<T> = {
  data: T[];
  size: number;
  nextCursor: string | null;
  hasNextPage: boolean;
};
