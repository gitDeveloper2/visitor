import { listPublishedBlogs } from '@features/blog/services/blogService';
import ToolPage from '@features/tools/components/ToolPage';
import { getTool } from '@features/tools/service/toolService';
import { notFound } from 'next/navigation';

type Params = Promise<{ id: string }>

export default async function ToolDetailPage(props: { params: Params }) {
  const params = await props.params;
    const tool = await getTool(params.id);
    console.log(tool)
    const blogs = await listPublishedBlogs({ limit: 5 });
    if (!tool) return notFound();
    return <ToolPage tool={tool} blogs={blogs} />;
  }
  