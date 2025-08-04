// data/links.ts

export interface LinkItem {
    to: string;
    primary: string;
  }
  
  // Define links with indexes as keys
  const linksIndex: Record<string, LinkItem[]> = {
    'devops': [
      // Add DevOps related items here if needed
    ],
    'js': [
      // Combine items from 'prisma' and 'zod'
     
      {
        to: "/blog/d3_data_driven_documents_overview",
        primary: "Key Concepts of D3 js. (A d3 data driven documents overview)",
      },
      {
        to: "/blog/prisma-self-relations",
        primary: "Prisma Self Relations",
      },
      {
        to: "/blog/zod_full_tutorial",
        primary: "How to Learn Zod: Complete Guide to Zod Schema, Validation, Transformations, and More",
      },
      {
        to: "/blog/zod_enum_validation",
        primary: "Mastering Zod Enum Validation: A Comprehensive Guide",
      },
    ],
  };
  function shuffleArray<T>(array: T[]): T[] {
    // Create a copy of the array to avoid modifying the original
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
  }
  
  export default function getRelatedPages(index: string, excludeTo: string): LinkItem[] {
    // Retrieve the array from linksIndex using the provided index
    const items = linksIndex[index] || [];
    
    // Filter out items where the primary string matches the excludePrimary
    const filteredItems =items.filter(item => item.to !== excludeTo);
return filteredItems;
  //   const shuffledItems = shuffleArray(filteredItems);

  // // Return only the first 10 items
  // return shuffledItems.slice(0, 10);
  }
  