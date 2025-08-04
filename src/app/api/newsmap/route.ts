import { connectToDatabase } from '@lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  const { db } = await connectToDatabase()

  const baseUrl = 'https://basicutils.com'

  // Only published "news" items from last 48 hours
  const allArticles = await db
    .collection('news')
    .find({
      isPublished: true,
      // news: true,
      // created_at: {
      //   $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 48 hrs
      // }
    })
    .project({
      domain: 1,
      slug: 1,
      title: 1,
      created_at: 1,
      authorId: 1
    })
    .toArray()



    const twoDaysAgo = new Date(Date.now() - 2 * 86400000);

    
    const newsItems = allArticles.filter(
      article => new Date(article.created_at) >= twoDaysAgo
    );




  const xmlItems = newsItems.map(item => {
    const articleUrl = `${baseUrl}/news/${item.domain}/${item.slug}`
    const pubDate = new Date(item.created_at).toISOString().split('T')[0] // "YYYY-MM-DD"

    return `
      <url>
        <loc>${articleUrl}</loc>
        <news:news>
          <news:publication>
            <news:name>Basic Utils News</news:name>
            <news:language>en</news:language>
          </news:publication>
          <news:publication_date>${pubDate}</news:publication_date>
          <news:title>${escapeXml(item.title)}</news:title>
        </news:news>
      </url>
    `
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    ${xmlItems.join('\n')}
  </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
