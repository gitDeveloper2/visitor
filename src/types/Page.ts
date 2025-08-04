// types/page.ts
export interface Page {
    domain: string;
    slug: string;
    title: string;
    content: string;
    keywords: string;
    metaDescription: string;
    canonical?: string;
    contentType: string;
    author: string;
    published: boolean;
    date: Date;
    dateUpdated?: Date;
  }
  
  
  export interface PageActionResponse<T = any> {
    status: number;
    data?: T;
    error?: string;
  }
  