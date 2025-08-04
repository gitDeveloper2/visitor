"use server"
import { connectToDatabase } from "../lib/mongodb";
import BlogPost from "../models/BlogPost";
import { getDB } from "../utils/dbutils";

// Retrieve a specific page by domain and slug
export async function getPageData(domain: string, slug: string,content:string) {
  try {
    
    const { db } = await connectToDatabase();
    const page = await db.collection(getDB(content)).findOne({ domain, slug });
    if (!page) {
      throw new Error("Page not found");
    }
    return page;
  } catch (error) {
    console.error("Failed to retrieve page data:", error);
    throw new Error("Failed to retrieve page data");
  }
}

// Retrieve all pages (e.g., for listing in admin)
export async function getAllPages(content:string) {

  try {
    const { db } = await connectToDatabase();
    const pages = await db.collection(getDB(content)).find().toArray();
    return pages.map(page => ({
      ...page,
      _id: page._id.toString(), // Convert ObjectId to string for easier handling in frontend
    }));
  } catch (error) {
    console.error("Failed to retrieve pages:", error);
    throw new Error("Failed to retrieve pages");
  }
}


// Update a specific page by domain and slug
export async function updatePage(domain: string, slug: string, data: any,content:string) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection(getDB(content)).findOneAndUpdate(
      { domain, slug },
      { $set: data },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      throw new Error("Page not found");
    }
    return result.value;
  } catch (error) {
    console.error("Failed to update page:", error);
    throw new Error("Failed to update page");
  }
}

// Delete a specific page by domain and slug
export async function deletePage(domain: string, slug: string,content:string) {
  try {
    const { db } = await connectToDatabase();
    
    const result = await db.collection(getDB(content)).findOneAndDelete({ domain, slug });
    // if (!result.value) {
    //   throw new Error("Page not found");
    // }
    return { message: "Page deleted successfully" };
  } catch (error) {
    console.error("Failed to delete page:", error);
    throw new Error("Failed to delete page");
  }
}



export async function togglePublish(slug:string,content:string){
  try{
  const {db}=await connectToDatabase();
  db.collection(getDB(content)).updateOne({slug:slug},[
   { $set:{
    isPublished:{$not:"$isPublished"}
  }}
  ])
  return {message:"page published succesfully"}
}catch(error){
  console.error("Failed to publish page:", error);
    throw new Error("Failed to publish page");
}
  
}