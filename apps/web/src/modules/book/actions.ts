import { cache } from "react";

export const getBook = cache((bookId: string) => {
  // TODO fetch actual stratbook
  return { name: `Book ${bookId}` };
});
