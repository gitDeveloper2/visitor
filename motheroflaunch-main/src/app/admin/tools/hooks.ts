import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
interface UseAdminToolsParams {
  cursor?: string;
  limit?: number;
  searchQuery?: string;
  status?: string;
  refetchFlag?: number; // 👈 Add this
}

export function useAdminTools(params: UseAdminToolsParams) {
 
  return useQuery({
    queryKey: ['admin-tools', params],
    queryFn: async () => {
      const res = await fetch(`/api/admin/tools?cursor=${params.cursor}&limit=${params.limit}&searchQuery=${params.searchQuery}&status=${params.status}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tools');
      }
      return res.json();
    },
  });
}

export const actionConfig = {
  suspend: { method: 'PATCH', endpoint: (id: string) => `/api/admin/tools/${id}/suspend` },
  reschedule: { method: 'PATCH', endpoint: (id: string) => `/api/admin/tools/${id}/reschedule` },
  unsuspend: { method: 'PATCH', endpoint: (id: string) => `/api/admin/tools/${id}/unsuspend` },
  promote: { method: 'PATCH', endpoint: (id: string) => `/api/admin/tools/${id}/promote` },
  demote: { method: 'PATCH', endpoint: (id: string) => `/api/admin/tools/${id}/demote` },
  delete: { method: 'DELETE', endpoint: (id: string) => `/api/admin/tools/${id}/delete` },
} as const;

export type ToolAction = keyof typeof actionConfig;



export function useToolAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ toolId, action, body }: {
      toolId: string;
      action: ToolAction;
      body?: Record<string, any>;
    }) => {
      const { method, endpoint } = actionConfig[action];
      const res = await fetch(endpoint(toolId), {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        throw new Error(`Failed to ${action} tool`);
      }

      return res.json(); // In case you want to return new status, etc.
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-tools'] });
    },
  });
}
