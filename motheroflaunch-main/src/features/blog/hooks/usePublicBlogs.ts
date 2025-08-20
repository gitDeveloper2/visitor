import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

export function usePublicBlogFeed() {
  return useQuery({
    queryKey: ['publicBlogFeed'],
    queryFn: async () => {
      const res = await fetch('/api/blogs/public');
      if (!res.ok) throw new Error('Failed to fetch blog feed');
      return res.json(); // { featured: Blog[], trending: Blog[], latest: Blog[] }
    },
    staleTime: 1000 * 60 * 1, // 30 minutes
  });
}


export function usePaginatedLatestBlogs() {
  return useInfiniteQuery({
    queryKey: ['latestBlogs'],
    queryFn: async ({ pageParam = null }) => {
      const url = new URL('/api/blogs/public/latest', window.location.origin);
      if (pageParam) url.searchParams.set('cursor', pageParam);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Failed to fetch latest blogs');
      return res.json(); // { blogs, nextCursor }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null, // ✅ This line fixes the TS error
  });
}


