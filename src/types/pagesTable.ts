import { PageStats } from "./PageStats";

interface PagesTable {
    domain: string;
    slug: string;
    title: string;
    created_at: string;
    isPublished: boolean;
  }
  
  export interface PagesTableProps {
    paginatedPages: PagesTable[];
    pageStats: PageStats[];
    loadingStates: Record<string, Record<string, boolean>>;
    handlePublish: (slug: string) => void;
    handleDelete: (domain: string, slug: string) => void;
    handleRevalidate: (domain: string, slug: string) => void;
    handleRecalculate: (slug: string) => void;
    handleRedirectToPage: (domain: string, slug: string) => string;
    handleEditMetadata:(page:any) => void;
    handleToggleShareModal:()=>void;
    content:string;
  }
  