import { NextResponse } from 'next/server';
import { recalculatePageStats } from "../../../lib/services/grammer/seoService";
import {  NextApiResponse } from 'next';
// import { getPageBySlug, updatePageStats } from '@/services/pageService';
// import { extractStatsFromHtml } from '@/utils/stats';
import { updatePageStats} from "../../../lib/services/grammer/pageStatsService";
import { connectToDatabase } from "../../../lib/mongodb";
import { analyzePage } from "../../../lib/services/grammer/contentAnalysisService";
import { PageStats } from "../../../types/PageStats";
import { extractTextContentFromHTML } from '../../../utils/transformers/HtmlStrings';

export async function POST(req: Request) {
  const  getPageBySlug= async (slug:string) => {
    const { db } = await connectToDatabase();
      const page = await db.collection('pages').findOne({  slug: slug });
    
      return page;
  }
  try {
   
    const { slug } = await req.json(); 
  
    if (!slug) {
      
      return NextResponse.json({ message: 'Slug is required'},{status:400} );
    }

    // Fetch the HTML content of the page from the database
    const page = await getPageBySlug(slug);

    if (!page || !page.content) {
      
      return NextResponse.json({ message: 'Page not found or HTML content missing' },{status:404} );
    }

    const textContent=extractTextContentFromHTML(page.content)
  

    // Extract stats from the HTML content
    const stats = await analyzePage(textContent)


  // Assuming the structure of stats is correct and has the necessary fields
const statsToSave: PageStats = {
  slug,
  stats: {
    daleChallScore:stats.daleChallScore,
    fleschKincaidGrade:stats.fleschKincaidGrade,
    fleschReadingEase:stats.fleschReadingEase,
    overallScore:stats.overallScore,
    passiveCount:stats.passiveCount,
    totalSentences:stats.totalSentences,
    totalWords:stats.totalWords, 
    slug,
    url:slug
  },
  updatedAt: new Date(),  // Optionally add updatedAt if needed
};

    await updatePageStats(slug, statsToSave);
    
    return NextResponse.json({ message: 'Recalculation successful', stats },{status:200} );
  } catch (error) {
    console.error('Recalculation error:', error);
    return     NextResponse.json({ message: 'Internal server error'},{status:500} );

  }
}
