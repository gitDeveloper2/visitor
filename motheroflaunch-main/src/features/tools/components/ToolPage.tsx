'use client';

  
import {
  Box,
  Tabs,
  Tab,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Container,
} from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';


import { ITool, UITool } from '../models/Tools';
import GiscusComments from '@features/shared/components/Giscus';
import OverviewTab from './tabs/OverviewTab';
import FeaturesTab from './tabs/FeaturesTab';
import PricingTab from './tabs/PricingTab';
import DetailsTab from './tabs/DetailsTab';
import TodaysLaunches from './TodaysLaunches';
import FeaturedLists from './FeaturedLists';
import VoteButton from './VoteButton';
import { useVotesContext } from '@features/providers/VotesContext';
import { CommentsWithAuth } from '@features/comments/components/commentsWithAuth';
import { TopBlogsSection } from './TopBlogsSection';
import MakerTab from './tabs/CreatorsTab';

type Props = {
  tool: UITool;
  blogs: any[]; // ✅ Add this
};

export default function ToolPage({ tool, blogs }: Props) {

  const votes = useVotesContext();

  const [tab, setTab] = useState(0);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Container sx={{mt:3}}>
     
    <Grid container spacing={5}>
      {/* Main content */}
      <Grid size={{md:8,xs:12}} >
        {/* Header: Logo + Name + Tagline + Website + Votes */}
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Card sx={{ width: 64, height: 64, p: 1, borderRadius: 2 }}>
            <Image
              src={tool.logo.url}
              alt={tool.name}
              width={48}
              height={48}
              style={{ objectFit: 'contain' }}
            />
          </Card>
          <Box flex={1}>
            <Typography variant="h4" fontWeight={600}>
            testing stuff
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {tool.tagline}
            </Typography>
            <Box mt={1}>
              {(tool.tags?.split(',') || []).map(tag => (
                <Chip
                  key={tag.trim()}
                  label={tag.trim()}
                  color="primary"
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
          </Box>
          <Box textAlign="right">
            <Button
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              sx={{ mb: 1,mr:2 }}
            >
              Visit WebsiteR
            </Button>
            <VoteButton   toolId={tool._id}
  initialVotes={tool.stats.votes}
  launchDate="2025-06-25T12:00:00.000Z" // ISO string
  votes={votes}
  />

           
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs value={tab} onChange={handleChange} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Features" />
          <Tab label="Pricing" />
          <Tab label="Details" />
          <Tab label="Creators" />
          
        </Tabs>
        <Divider sx={{ mb: 3 }} />

        {/* Tab Content */}
        {tab === 0 && <OverviewTab tool={tool} />}
        {tab === 1 && <FeaturesTab features={tool.features} />}
{tab === 2 && <PricingTab pricing={tool.pricing} />}
{tab === 3 && <DetailsTab tool={tool} />}
{tab === 4 && tool.ownerId && typeof tool.ownerId === 'object' && 'name' in tool.ownerId && (
  <MakerTab
    creator={{
      name: tool.ownerId.name,
      avatarUrl: tool.ownerId.avatarUrl ?? "",
      headline: tool.ownerId.bio,
      bio: tool.ownerId.bio,
      githubUsername: tool.ownerId.githubUsername,
      twitterUsername: tool.ownerId.twitterUsername,
      websiteUrl: tool.ownerId.websiteUrl,
    }}
    otherTools={[]}
  />
)}




        <Box mt={4}>
          {/* <GiscusComments term={tool._id.toString()} /> */}
            <CommentsWithAuth  page={tool.slug}/>
        </Box>
      </Grid>

      {/* Sidebar */}
      <Grid size={{md:4,xs:12}} >
        <Box position="sticky" top={88}>
      {/* <TodaysLaunches launches={todaysLaunches} /> */}
      <TopBlogsSection blogs={blogs}/>

      {/* <FeaturedLists lists={featuredLists} /> */}
      </Box>
      </Grid>
    </Grid>
    </Container>
  );
}
