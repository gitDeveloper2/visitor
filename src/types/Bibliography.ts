export type ReferenceTypes = "book" | "article" | "website" | "journal" | "thesis";

export interface Reference {
  id: string;
  authorFirstName?: string; // Optional for cases without authors
  authorLastName?: string;  // Optional for cases without authors
  title: string;
  publisher?: string; // Optional for websites, theses, etc.
  date: string; // Always required
  url?: string; // Optional for non-online sources
  type: ReferenceTypes;
  journalName?: string; // Relevant only for journals
  volume?: string; // For journal articles
  issue?: string; // For journal articles
  pageRange?: string; // For journal articles
  doi?: string; // For articles with DOI
  websiteName?: string; // Optional for websites
  linkText:string;
  kind:string;
}
