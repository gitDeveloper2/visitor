import Tools, { ITool } from "../models/Tools";
import { Types } from "mongoose";
import { CursorPaginatedResult } from "../types";
import { deepSerialize, stringifyID } from "../../shared/utils/mongo";
import redis from "../../shared/lib/redis";
import { connectToMongo } from "@features/shared/lib/mongoose";
import Category, { ICategory } from "../models/Category";

// Get all tools
export async function getAllTools() {
  const tools = await Tools.find().sort({ createdAt: -1 }).lean();
  return tools.map(stringifyID);
}


export async function getPaginatedTools(
  size: number = 10,
  cursor?: string,
  query: string = "",
  tag?: string,
  categorySlugOrId?: string,
  period?: "daily" | "weekly" | "monthly"
): Promise<CursorPaginatedResult<ITool & { _id: string }>> {
  await connectToMongo();

  const redisKey = `tools:cursor:${cursor || "first"}:size:${size}:q:${query}:t:${tag}:c:${categorySlugOrId}:p:${period}`;
  const cached = await redis.get(redisKey);
  if (cached) return JSON.parse(cached);

  const filters: any = {};

  if (query.trim()) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (tag) filters.tags = tag;

  // 🧠 Handle category (slug or ObjectId)
  if (categorySlugOrId) {
    const categoryObj = Types.ObjectId.isValid(categorySlugOrId)
      ? { _id: categorySlugOrId }
      : { slug: categorySlugOrId };

      const categoryDoc = await Category.findOne(categoryObj).lean();

      if (categoryDoc && !Array.isArray(categoryDoc)) {
        filters.category = categoryDoc._id;
      }
      
  }

  // 🕒 Date range filter
  if (period) {
    const now = new Date();
    let start: Date | null = null;

    if (period === "daily") {
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
    } else if (period === "weekly") {
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
    } else if (period === "monthly") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    if (start) {
      filters.createdAt = { ...(filters.createdAt || {}), $gte: start };
    }
  }

  if (cursor) {
    filters.createdAt = { ...(filters.createdAt || {}), $lt: new Date(cursor) };
  }

  const tools = await Tools.find(filters)
    .sort({ createdAt: -1 })
    .limit(size + 1)
    .populate([
      { path: "category", select: "name slug color" },
    ])    
        .lean();

  const hasNextPage = tools.length > size;
  const paginated = tools.slice(0, size);

  const nextCursor = hasNextPage
    ? paginated[size - 1].createdAt.toISOString()
    : null;

  const result = {
    data: paginated.map(stringifyID),
    size,
    nextCursor,
    hasNextPage,
  };

  await redis.set(redisKey, JSON.stringify(result));
  return result;
}



// Get single tool by ID or slug
export async function getTool(id: string): Promise<(ITool & { _id: string }) | null> {
  const filter = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
  const tool = await Tools.findOne(filter)
  .populate([
    { path: "category", select: "name slug color" },
    {
      path: "ownerId",
      model: "User",
      select: "name avatarUrl role bio headline githubUsername twitterUsername websiteUrl",
    },
  ])
  
  .lean();
  return tool ? deepSerialize(tool) : null;

}

// Create tool and invalidate relevant Redis keys
export async function createTool(

  data: Omit<ITool, "_id" | "createdAt" | "updatedAt">
): Promise<ITool & { _id: string }> {
  await connectToMongo()
  console.log("creating",data)

  const newTool = await Tools.create(data);
  await redis.del("tools:cursor:first:size:10:q::t::c:"); // Invalidate first page
  return stringifyID(newTool);
}

// Update tool and invalidate individual + first page
export async function updateTool(
  id: string,
  data: Partial<ITool>
): Promise<(ITool & { _id: string }) | null> {
  if (!Types.ObjectId.isValid(id)) return null;

  const updatedTool = await Tools.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();

  if (updatedTool) {
    await redis.del(`tool:${id}`);
    await redis.del("tools:cursor:first:size:10:q::t::c:");
    return stringifyID(updatedTool);
  }

  return null;
}

// Delete tool and invalidate cache
export async function deleteTool(id: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(id)) return false;

  const result = await Tools.findByIdAndDelete(id);
  if (result) {
    await redis.del(`tool:${id}`);
    await redis.del("tools:cursor:first:size:10:q::t::c:");
    return true;
  }

  return false;
}

// Tags
export async function getAllTags(): Promise<string[]> {
  const tags = await Tools.distinct("tags");
  return tags.sort();
}




