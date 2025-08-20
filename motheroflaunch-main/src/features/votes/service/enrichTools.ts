"use client"

import { env } from "@features/shared/lib/env";

const BASE_URL=env.APP_URL
export async function enrichWithVotes(tools) {
    const toolIds = tools.map(t => t._id.toString());
  
    if (toolIds.length === 0) return tools;
  
    const params = new URLSearchParams();
    for (const id of toolIds) {
      params.append('ids[]', id);
    }
  
    const res = await fetch(`${BASE_URL}/api/vote/batch-count?${params.toString()}`);
    if (!res.ok) {
      // fallback: just return tools without votes or with 0 votes
      return tools.map(t => ({ ...t, votes: 0 }));
    }
  
    const data = await res.json();
  
    if (!data.success) {
      return tools.map(t => ({ ...t, votes: 0 }));
    }
  
    const counts = data.counts;
  
    return tools.map(tool => ({
      ...tool,
      votes: counts[tool._id.toString()] ?? 0,
    }));
  }
  