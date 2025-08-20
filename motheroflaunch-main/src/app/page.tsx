// ExamplePage.tsx
import { listPublishedBlogs } from '@features/blog/services/blogService';
import CTABox from '@features/tools/components/CTABox';
import PaginatedToolsList from '@features/tools/components/ToolsList';
import { TopBlogsSection } from '@features/tools/components/TopBlogsSection';
import { getPaginatedTools } from '@features/tools/service/toolService';
import { Grid, Box, Container } from '@mui/material';


  export default async function PublicToolsPage() {
    const [daily, weekly, monthly,topBlogs] = await Promise.all([
      getPaginatedTools(5, undefined, "", undefined, undefined, "daily"),
      getPaginatedTools(5, undefined, "", undefined, undefined, "weekly"),
      getPaginatedTools(5, undefined, "", undefined, undefined, "monthly"),
      listPublishedBlogs({ limit: 5 }), // ← Top 5 published blogs

    ]);
  console.log(monthly.data)
  return (
    <Container sx={{mt:3}}>
    <Grid container spacing={5}>
      {/* Main Content */}
      <Grid size={{xs:12,md:8}}>
        <Box>
        <PaginatedToolsList key={'daily'}
        title="Top Launches"
        initialTools={daily.data}
        initialCursor={daily.nextCursor}
        period="daily"
      />
      <PaginatedToolsList key={'weekly'}
        title="Top Weekly Launches"
        initialTools={weekly.data}
        initialCursor={weekly.nextCursor}
        period="weekly"
      />
      <PaginatedToolsList key={'monthly'}
        title="Top Monthly Launches"
        initialTools={monthly.data}
        initialCursor={monthly.nextCursor}
        period="monthly"
      />
        </Box>
      </Grid>

      {/* Sidebar */}
      <Grid size={{ xs: 12, md: 4 }}>
  <Box position="sticky" top={88} display="flex" flexDirection="column" gap={3}>
    <CTABox />
    <TopBlogsSection blogs={topBlogs} />
    {/* <ToolsNeedingLove tools={toolsNeedingLove} /> */}

    {/* <LaunchTips
      tips={[
        'Add real screenshots – not just mockups.',
        'Be specific in your tagline.',
        'Share your launch in relevant communities.',
      ]}
    /> */}

  </Box>
</Grid>

    </Grid>
    </Container>
  );
}
