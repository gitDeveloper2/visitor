// app/dashboard/DashboardOverview.server.tsx
import React from "react";
import { getUserDashboardData } from "@features/dashboard/service/dashboardservice";
import { DashboardOverviewClient } from "@features/dashboard/service/components/DashboardOverviewClient";
import { auth } from "../../../auth";
import { headers } from "next/headers";


export default async function DashboardOverview() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });  if (!session?.user?.id) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const data = await getUserDashboardData(session.user.id);

  return (
    <DashboardOverviewClient
      user={{
        name: session.user.name || "User",
        avatarUrl: session.user.image || "/avatar.png",
        stats: {
          tools: data.toolsCreatedCount,
          upvotes: data.totalVotesReceived,
          recentVotes: data.recentVotesCount,
        },
        nextLaunch: data.upcomingLaunch && data.upcomingLaunch.launchDate
        ? {
            name: data.upcomingLaunch.name,
            date: new Date(data.upcomingLaunch.launchDate).toLocaleDateString(),
          }
        : null,
      
        recentActivity: [
          ...data.recentTools.map((tool) => `You launched a new tool: ${tool.name}`),
          `You cast ${data.votesCast} votes`,
          `${data.zeroVoteToolsCount} tools with zero votes`,
        ],
      }}
    />
  );
}
