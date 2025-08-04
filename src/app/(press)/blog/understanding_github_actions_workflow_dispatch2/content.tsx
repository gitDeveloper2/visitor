"use client";
import "react-image-crop/dist/ReactCrop.css";
import { Grid, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { StyledSectionGrid } from "@components/layout/Spacing";
import BlogComponent, { LinkListItem } from "@components/blog/BlogContent";
import { CodeBox } from "@styles/globalStyles"; // Ensure this is correctly imported
import getRelatedPages from "../../../data/RelatedPages";
// import { ResponsiveNativeBannerAd } from "@components/adds/ResponsiveNativeBannerAd";
const parentPath = "devops";
const thisPagePath = "/blog/understanding_github_actions_workflow_dispatch";
export default function WorkflowDispatch() {
  const theme = useTheme();

  return (
    <StyledSectionGrid theme={theme} container gap={1} y16>
      <Grid item xs={12}>
        <BlogComponent
            relatedPages={getRelatedPages(parentPath,thisPagePath)}
          blogComponent={
            <>
              <Typography variant="h1" gutterBottom>
                A Comprehensive Guide to GitHub Actions Workflow Dispatch
              </Typography>

              <Typography variant="body1" paragraph>
                GitHub Actions has revolutionized the way developers automate workflows. Among its myriad features, the <strong>workflow_dispatch</strong> event stands out for its ability to manually trigger workflows. In this detailed guide, we will delve into the nuances of <strong>GitHub Actions workflow_dispatch</strong>, exploring its setup, configuration, and best practices. By understanding <strong>workflow dispatch inputs</strong> and other critical aspects, you’ll be better equipped to leverage this powerful feature in your CI/CD pipelines.
              </Typography>

              <Typography variant="h2" gutterBottom>
                What is GitHub Actions Workflow Dispatch?
              </Typography>

              <Typography variant="body1" paragraph>
                The <strong>GitHub Actions workflow_dispatch</strong> event is designed to manually trigger workflows in GitHub Actions. Unlike other events that are automatically triggered by Git events such as pushes or pull requests, <strong>workflow_dispatch</strong> gives you the flexibility to run workflows on demand. This feature is particularly useful for workflows that need to be executed under specific conditions or on an ad-hoc basis.
              </Typography>

              <Typography variant="h2" gutterBottom>
                Setting Up GitHub Actions Workflow Dispatch
              </Typography>

              <Typography variant="body1" paragraph>
                Configuring <strong>workflow_dispatch</strong> in your GitHub Actions workflow involves creating or updating a workflow YAML file. Here’s a step-by-step approach to get you started:
              </Typography>

              <Typography variant="h3" gutterBottom>
                1. Create or Modify Your Workflow YAML File
              </Typography>

              <Typography variant="body1" paragraph>
                To enable manual triggering of a workflow, you need to define the <strong>workflow_dispatch</strong> event in your YAML configuration. Here’s a basic example:
              </Typography>

              <CodeBox>
                {`name: Manual Trigger Workflow

on:
  workflow_dispatch:
    inputs:
      example_input:
        description: 'An example input for the workflow'
        required: false
        default: 'default_value'
      another_input:
        description: 'Another input'
        required: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Display inputs
        run: |
          echo "Example Input: \${{ github.event.inputs.example_input }}"
          echo "Another Input: \${{ github.event.inputs.another_input }}"
                `}
              </CodeBox>

              <Typography variant="body1" paragraph>
                In this example:
              </Typography>

              <List>
                <ListItem>
                  <ListItemText primary="name" secondary="Specifies the name of the workflow." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="on: workflow_dispatch" secondary="Indicates that this workflow can be manually triggered." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="inputs" secondary="Defines the parameters that can be provided when triggering the workflow." />
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                Understanding Workflow Dispatch Inputs
              </Typography>

              <Typography variant="body1" paragraph>
                <strong>Workflow dispatch inputs</strong> are parameters that can be passed to the workflow when it is manually triggered. These inputs are defined within the <strong>workflow_dispatch</strong> section of your YAML file and allow for greater flexibility in how your workflows are executed.
              </Typography>

              <Typography variant="h3" gutterBottom>
                Defining Inputs
              </Typography>

              <Typography variant="body1" paragraph>
                Inputs are configured in the <strong>workflow_dispatch</strong> section of your workflow YAML file. You can specify properties such as:
              </Typography>
{/* <ResponsiveNativeBannerAd/> */}
              <List>
                <ListItem>
                  <ListItemText primary="description" secondary="Provides a brief explanation of the input’s purpose." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="required" secondary="Indicates whether the input is mandatory when triggering the workflow." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="default" secondary="Sets a default value for the input if none is provided." />
                </ListItem>
              </List>

              <Typography variant="body1" paragraph>
                For example, consider the following YAML configuration:
              </Typography>

              <CodeBox>
                {`name: Advanced Workflow

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'The environment to deploy to'
        required: true
        default: 'staging'
      deploy_version:
        description: 'The version of the application to deploy'
        required: false
        default: 'latest'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy application
        run: |
          echo "Deploying version \${{ github.event.inputs.deploy_version }} to \${{ github.event.inputs.environment }} environment."
                `}
              </CodeBox>

              <Typography variant="body1" paragraph>
                In this advanced example:
              </Typography>

              <List>
                <ListItem>
                  <ListItemText primary="environment" secondary="Is a required input specifying the target deployment environment." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="deploy_version" secondary="Is an optional input for the application version to deploy." />
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                How to Trigger the Workflow
              </Typography>

              <Typography variant="body1" paragraph>
                Once your workflow is set up with <strong>workflow_dispatch</strong>, you can manually trigger it using several methods:
              </Typography>

              <Typography variant="h3" gutterBottom>
                Via GitHub UI
              </Typography>

              <Typography variant="body1" paragraph>
                To manually trigger a workflow via the GitHub UI:
              </Typography>

              <List>
                <ListItem>
                  <ListItemText primary="Go to the 'Actions' tab in your GitHub repository." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Select the workflow you wish to run." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Click the 'Run workflow' button." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Fill in the required inputs and click 'Run workflow' again to start the workflow." />
                </ListItem>
              </List>

              <Typography variant="h3" gutterBottom>
                Via GitHub API
              </Typography>

              <Typography variant="body1" paragraph>
                Alternatively, you can trigger a workflow using the GitHub REST API. Here’s an example using <strong>curl</strong>:
              </Typography>

              <CodeBox>
                {`curl -X POST \
-H "Accept: application/vnd.github+json" \
-H "Authorization: token YOUR_GITHUB_TOKEN" \
-H "Content-Type: application/json" \
--data '{"ref":"main","inputs":{"example_input":"value","another_input":"value"}}' \
https://api.github.com/repos/OWNER/REPO/actions/workflows/WORKFLOW_ID/dispatches
                `}
              </CodeBox>

              <Typography variant="h2" gutterBottom>
                Best Practices for Using Workflow Dispatch
              </Typography>

              <Typography variant="body1" paragraph>
                To maximize the benefits of <strong>workflow_dispatch</strong>, adhere to the following best practices:
              </Typography>

              <List>
                <ListItem>
                  <ListItemText primary="Use Clear Descriptions" secondary="Ensure that each input’s description is clear to guide users effectively." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Set Defaults Wisely" secondary="Provide sensible default values for optional inputs to streamline workflow execution." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Secure Sensitive Data" secondary="Avoid including sensitive data in inputs. Use GitHub secrets for sensitive information instead." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Document Workflow" secondary="Clearly document the purpose of each workflow and its inputs in your repository’s README or a dedicated documentation file." />
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                Common Use Cases for Workflow Dispatch
              </Typography>

              <Typography variant="body1" paragraph>
                The <strong>workflow_dispatch</strong> event is particularly useful in several scenarios:
              </Typography>

              <List>
                <ListItem>
                  <ListItemText primary="Manual Deployments" secondary="Trigger deployments to different environments as needed." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Testing Specific Branches" secondary="Run tests on specific branches or commits that are not automatically triggered by other events." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Running Ad-Hoc Jobs" secondary="Execute one-off tasks or maintenance jobs that do not fit into regular CI/CD pipelines." />
                </ListItem>
              </List>

              <Typography variant="h2" gutterBottom>
                Conclusion
              </Typography>

              <Typography variant="body1" paragraph>
                The <strong>GitHub Actions workflow_dispatch</strong> event is a versatile feature that provides significant flexibility in managing and executing workflows. By understanding how to configure and use <strong>workflow_dispatch</strong>, you can improve your workflow automation and gain greater control over your CI/CD processes. Whether you are performing manual deployments or running specific tests, <strong>workflow_dispatch</strong> can greatly enhance your development workflow.
              </Typography>

              <Typography variant="body1" paragraph>
                For more information on GitHub Actions and other advanced features, visit the <Button variant="contained" color="primary" href="https://docs.github.com/en/actions">official GitHub Actions documentation</Button>.
              </Typography>
            </>
          }
        />
      </Grid>
    </StyledSectionGrid>
  );
}
