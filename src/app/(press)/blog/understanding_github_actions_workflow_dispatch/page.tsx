import React, { ReactElement } from "react";
import { generatePageMetadata } from "../../../../lib/MetadataGenerator";
import PrismaSelfRelations from "./content";


export async function generateMetadata() {
  return generatePageMetadata({
    title: "GitHub Actions Workflow Dispatch: Comprehensive Guide & Best Practices",
    description: "Explore our detailed guide on GitHub Actions `workflow_dispatch`. Learn how to set up manual triggers, configure workflow dispatch inputs, and leverage this feature for advanced CI/CD automation. Discover best practices, common use cases, and enhance your development workflow with ease.",
    keywords: "github actions workflow_dispatch, workflow dispatch inputs, workflow dispatch github, github actions, manual trigger workflows, CI/CD automation, GitHub Actions best practices, workflow configuration",
    canonicalUrl:"/blog/understanding_github_actions_workflow_dispatch2"
  });
}

export default function Test() {
  

  return (
   <PrismaSelfRelations/>
  );
}
