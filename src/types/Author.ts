
export interface AuthorProfile {
    authorId?: string;
    name?: string;
    bio?: string;
    profilePicture?: string;
    socialLinks?: {
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      email?: string;
      link?:string;
    };
    jobTitle?: string;
    organization?: {
      name?: string;
      url?: string;
    };
    expertise?: string[];
    education?: {
      university?: string;
      degree?: string;
      graduationYear?: number;
    };
    birthDate?: string; // ISO format (e.g., "1982-01-01")
    nationality?: string;
    contact?: {
      website?: string;
    };
  }
  