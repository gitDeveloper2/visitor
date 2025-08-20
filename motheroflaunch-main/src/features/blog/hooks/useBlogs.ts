import { useInfiniteQuery } from '@tanstack/react-query'

export function useAdminBlogs({ searchQuery = '' }: { searchQuery?: string }) {
  return useInfiniteQuery({
    queryKey: ['adminBlogs', searchQuery],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams()
      if (searchQuery) params.set('q', searchQuery)
      if (pageParam) params.set('cursor', pageParam)

      const res = await fetch(`/api/blogs?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch blogs')

      return res.json() // Expected: { blogs: Blog[], nextCursor: string | null }
    },
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
  })
}


export type UseBlogsParams = {
  searchQuery?: string;
  authorId?: string; // For filtering by user (optional for admin)
  status?: 'draft' | 'published';
};

export function useBlogs({ searchQuery = '', authorId, status }: UseBlogsParams) {
  return useInfiniteQuery({
    queryKey: ['blogs', { searchQuery, authorId, status }],
    initialPageParam: null,
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (authorId) params.set('authorId', authorId);
      if (status) params.set('status', status);
      if (pageParam) params.set('cursor', pageParam);

      const res = await fetch(`/api/blogs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch blogs');

      return res.json(); // { items, nextCursor }
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}


