import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { getAllPages } from '../../actions/blogActions';

// export function usePages(refreshFlag: boolean, sortOrder: string, searchQuery: string) {
//   const [pages, setPages] = useState<any[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchPages() {
//       setLoading(true);
//       setError(null);
//       try {
//         const pagesData = await getAllPages();
//         setPages(pagesData);
//       } catch (err) {
//         console.error("Failed to fetch pages:", err);
//         setError("Failed to load pages");
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchPages();
//   }, [refreshFlag]);

//   const sortedPages = pages
//     .filter(page =>
//       page.title.toLowerCase().includes(searchQuery) ||
//       page.domain.toLowerCase().includes(searchQuery) ||
//       page.slug.toLowerCase().includes(searchQuery)
//     )
//     .sort((a, b) => {
//       const aDate = dayjs(a.created_at).isValid() ? dayjs(a.created_at).valueOf() : Number.POSITIVE_INFINITY;
//       const bDate = dayjs(b.created_at).isValid() ? dayjs(b.created_at).valueOf() : Number.POSITIVE_INFINITY;

//       return sortOrder === 'asc' ? aDate - bDate : bDate - aDate || a.slug.localeCompare(b.slug);
//     });

//   return { pages: sortedPages, error, loading, setPages };
// }
