import { NextResponse } from 'next/server'

// Simple AI crawler discovery file similar to robots.txt
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://basicutils.com'
  const body = [
    `# AI crawler directives for BasicUtils`,
    `# See: https://ai.txt for emerging community standard`,
    `User-agent: *`,
    `Allow: /`,
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n')
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

