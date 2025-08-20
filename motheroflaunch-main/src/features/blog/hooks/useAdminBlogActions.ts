import { useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'

export function useAdminBlogActions() {
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const deleteBlog = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?')
    if (!confirmed) return

    const res = await fetch(`/api/blogs/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      enqueueSnackbar('Failed to delete blog', { variant: 'error' })
      return
    }

    enqueueSnackbar('Blog deleted', { variant: 'success' })
    queryClient.invalidateQueries({ queryKey: ['adminBlogs'] })
queryClient.invalidateQueries({ queryKey: ['blogs'] })

  }

  const togglePublish = async (id: string, publish: boolean) => {
    console.log(publish)
    const res = await fetch(`/api/blogs/${id}/publish`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: publish }),
    })

    if (!res.ok) {
      enqueueSnackbar('Failed to update publish status', { variant: 'error' })
      return
    }

    enqueueSnackbar(publish ? 'Blog published' : 'Blog unpublished', {
      variant: 'success',
    })

    queryClient.invalidateQueries({ queryKey: ['adminBlogs'] })
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
    
  }

  const share = (blog: { slug: string }) => {
    const url = `${window.location.origin}/blogs/${blog.slug}`
    navigator.clipboard.writeText(url)
    enqueueSnackbar('Copied link to clipboard', { variant: 'info' })
  }
  const toggleSuspension = async (id: string, suspend: boolean) => {
    const res = await fetch(`/api/blogs/${id}/suspend`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ suspend }),
    });
  
    if (!res.ok) {
      enqueueSnackbar('Failed to update suspension status', { variant: 'error' });
      return;
    }
  
    enqueueSnackbar(suspend ? 'Blog suspended' : 'Blog unsuspended', {
      variant: 'success',
    });
  
    queryClient.invalidateQueries({ queryKey: ['adminBlogs'] })
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
    
  };
  

  return { deleteBlog, togglePublish, toggleSuspension, share }
}
