import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, Link, IconButton, Box } from '@mui/material';
import { Code, Laptop, Brush, AccessTime, Cloud, Settings } from '@mui/icons-material';

const UsesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          What I Use to Build and Create
        </Typography>
        <Typography variant="body1" paragraph>
          Curious about the tools I use for programming, design, and productivity? Here's a list of everything I rely on daily for coding, designing, and managing my projects.
        </Typography>
      </Box>

      {/* Development Setup Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          <Laptop sx={{ mr: 2 }} /> My Development Setup
        </Typography>
        <Typography variant="body1" paragraph>
          Here's a look at the tools and technologies I use to code and build my projects.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Editor: Visual Studio Code"
              secondary={
                <Link href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">
                  Visual Studio Code
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Version Control: Git & GitHub"
              secondary={
                <>
                  <Link href="https://git-scm.com/" target="_blank" rel="noopener noreferrer">
                    Git
                  </Link>{' '}
                  &{' '}
                  <Link href="https://github.com/" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </Link>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Framework: React & Next.js"
              secondary={
                <>
                  <Link href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
                    React
                  </Link>{' '}
                  &{' '}
                  <Link href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
                    Next.js
                  </Link>
                </>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Programming Language: TypeScript"
              secondary={
                <Link href="https://www.typescriptlang.org/" target="_blank" rel="noopener noreferrer">
                  TypeScript
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="API Testing: Postman"
              secondary={
                <Link href="https://www.postman.com/" target="_blank" rel="noopener noreferrer">
                  Postman
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Design Tools Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          <Brush sx={{ mr: 2 }} /> Design Tools
        </Typography>
        <Typography variant="body1" paragraph>
          I rely on these tools to create beautiful and functional designs for websites and applications.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Design Software: Figma"
              secondary={
                <Link href="https://www.figma.com/" target="_blank" rel="noopener noreferrer">
                  Figma
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Icons: Material-UI Icons"
              secondary={
                <Link href="https://mui.com/components/icons/" target="_blank" rel="noopener noreferrer">
                  Material-UI Icons
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Productivity Tools Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          <AccessTime sx={{ mr: 2 }} /> Productivity Tools
        </Typography>
        <Typography variant="body1" paragraph>
          These tools help me stay organized and productive while juggling multiple projects.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Task Management: ClickUp"
              secondary={
                <Link href="https://www.clickup.com/" target="_blank" rel="noopener noreferrer">
                  ClickUp
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Time Tracking: Toggl"
              secondary={
                <Link href="https://toggl.com/" target="_blank" rel="noopener noreferrer">
                  Toggl
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Notes: Google Keep"
              secondary={
                <Link href="https://keep.google.com/" target="_blank" rel="noopener noreferrer">
                  Google Keep
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Libraries & Tools Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          <Settings sx={{ mr: 2 }} /> Useful Libraries & Tools
        </Typography>
        <Typography variant="body1" paragraph>
          Here are a few libraries and tools that I frequently use to speed up development and enhance my projects.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="UI Components: Material-UI"
              secondary={
                <Link href="https://mui.com/" target="_blank" rel="noopener noreferrer">
                  Material-UI
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Forms: React Hook Form"
              secondary={
                <Link href="https://react-hook-form.com/" target="_blank" rel="noopener noreferrer">
                  React Hook Form
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="State Management: Redux"
              secondary={
                <Link href="https://redux.js.org/" target="_blank" rel="noopener noreferrer">
                  Redux
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Web Hosting Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          <Cloud sx={{ mr: 2 }} /> Web Hosting & Infrastructure
        </Typography>
        <Typography variant="body1" paragraph>
          These are the services I use for hosting and deploying my websites and APIs.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Hosting: Vercel"
              secondary={
                <Link href="https://vercel.com/" target="_blank" rel="noopener noreferrer">
                  Vercel
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Cloud Storage: Google Cloud"
              secondary={
                <Link href="https://cloud.google.com/" target="_blank" rel="noopener noreferrer">
                  Google Cloud
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      {/* Learning Resources Section */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          📚 Learning Resources
        </Typography>
        <Typography variant="body1" paragraph>
          These are the resources I use to stay up-to-date with the latest trends and learn new technologies.
        </Typography>
        <List>
          <ListItem>
            <ListItemText
              primary="Documentation: MDN Web Docs"
              secondary={
                <Link href="https://developer.mozilla.org/en-US/" target="_blank" rel="noopener noreferrer">
                  MDN Web Docs
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="AI Assistance: ChatGPT"
              secondary={
                <Link href="https://chat.openai.com/" target="_blank" rel="noopener noreferrer">
                  ChatGPT
                </Link>
              }
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Podcasts"
              secondary={
                <Link href="https://www.shoptalkshow.com/" target="_blank" rel="noopener noreferrer">
                  ShopTalk Show 
                </Link>
              }
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="body2" color="textSecondary">
          Updated: January 2025
        </Typography>
      </Box>
    </Container>
  );
};

export default UsesPage;
