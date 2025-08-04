export type RepoData = {
    date: string;
  } & Record<string, number|string>;


  // { [repoName: string]: string | number; date: string; }[]
  
export   type ProcessedData = {
    date: string;
    timestamp: number;
    [repo: string]: string | number;
  };
  
  export type StarGazersProps = {
    data: RepoData[];
  };