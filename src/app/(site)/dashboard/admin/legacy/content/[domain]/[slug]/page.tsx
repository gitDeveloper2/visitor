import { Box, Button, Typography } from "@mui/material";
import QuillEditor from "@components/libs/QuilEditor2"; 
import { getServerSession } from "../../../../../lib/auth";
import {redirect} from "next/navigation"
import { connectToDatabase } from "@lib/mongodb";

// Force dynamic rendering to prevent build-time static generation issues
export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { domain: string; slug: string } }) {
  // const session=await getServerSession()
  // console.log(session)
  // if (!session) {
  //   redirect(`/api/auth/signin?callbackUrl=/content/${params.domain}/${params.slug}`);

  // }
  const { db } = await connectToDatabase();
  const page = await db.collection('pages').findOne({ domain: params.domain, slug: params.slug });
  
  if (!page) {
    return <div>Page not found</div>;
  }

  return <>
    <Box sx={{ padding: 2 }}>
      
      <QuillEditor content="blog" initialContent={page.content} slug={params.slug} refs={page.refs} faqs={page.faqs} />
    
    </Box>
  </>

  // return <QuillPageClient initialContent={page.content} domain={params.domain} slug={params.slug} />;
}
