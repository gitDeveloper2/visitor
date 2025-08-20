import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

interface FetchToolsParams {
  role: 'admin' | 'user';
  cursor?: string | null;
}

interface Tool {
  _id: string;
  name: string;
  tagline?: string;
  votes: number;
  createdAt: string;
  status: 'launched' | 'upcoming';
}

interface ApiResponse {
  success: boolean;
  data: Tool[];
  size: number;
  nextCursor: string | null;
  hasNextPage: boolean;
  error?: string;
}

const fetchTools = async ({ role, cursor }: FetchToolsParams): Promise<ApiResponse> => {
  const url = new URL(
    role === 'admin' ? '/api/tools' : '/api/tools/user',
    window.location.origin
  );
  url.searchParams.set('size', '10');
  if (cursor) url.searchParams.set('cursor', cursor);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
};

// ✅ Infinite pagination
export function useTools(role: 'admin' | 'user') {
  return useInfiniteQuery<ApiResponse, Error, ApiResponse, [string, string], string | null>({
    queryKey: ['tools', role],
    queryFn: ({ pageParam }) =>
      fetchTools({ role, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    initialPageParam: null,
  });
}


export function useDeleteTool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete tool');
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tools'] });
    },
  });
}
