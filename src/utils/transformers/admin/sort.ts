import dayjs from "dayjs";

export function sortPages(pages:any,searchQuery:string,sortOrder:string) {
    return structuredClone([...pages]

      .filter(page => page.title.toLowerCase().includes(searchQuery) ||
        page.domain.toLowerCase().includes(searchQuery) ||
        page.slug.toLowerCase().includes(searchQuery)
      )
      .sort((a, b) => {

        const aDate = dayjs(a.created_at).isValid() ? dayjs(a.created_at).valueOf() : Number.POSITIVE_INFINITY;
        const bDate = dayjs(b.created_at).isValid() ? dayjs(b.created_at).valueOf() : Number.POSITIVE_INFINITY;

        // Primary sorting by date
        if (aDate !== bDate) {
          return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
        }

        // Secondary sorting by slug for consistency
        return a.slug.localeCompare(b.slug);
      }));
  }