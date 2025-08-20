// @features/blog/utils/serializeBlog.ts

export function serializeBlog(blog: any) {
    return {
      ...blog,
      _id: blog._id?.toString?.() ?? blog._id,
      createdAt: blog.createdAt?.toISOString?.() ?? blog.createdAt,
      updatedAt: blog.updatedAt?.toISOString?.() ?? blog.updatedAt,
      author: blog.author
        ? {
            ...blog.author,
            _id: blog.author._id?.toString?.() ?? blog.author._id,
          }
        : null,
      tool: blog.tool
        ? {
            ...blog.tool,
            _id: blog.tool._id?.toString?.() ?? blog.tool._id,
          }
        : null,
    };
  }
  