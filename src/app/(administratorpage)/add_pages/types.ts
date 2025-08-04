import { Control, FieldErrors } from "react-hook-form";

export interface FormData {
    domain: string;
    slug: string;
    title: string;
    content: string;
    keywords?: string;
    meta_description?: string;
    canonical_url?: string;
    image_url?:string;
    image_attribution?:string;
    image_caption?:string;
    relatedPages?: string; // Added field for related pages
    isPublished:boolean;
    news:boolean;
  }

  export interface AddPageProps{
    control:Control<FormData, any>,
    errors:FieldErrors<FormData>,

}