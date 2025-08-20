import { Types } from 'mongoose';
import Tools, { ITool } from '../models/Tools';

interface PaginatedTools {
  tools: ITool[];
  nextCursor: string | null;
}

export const toolService = {
  async fetchTools({
    cursor,
    limit,
    searchQuery,
    status,
  }: {
    cursor: string | null;
    limit: number;
    searchQuery?: string;
    status?: string;
  }): Promise<PaginatedTools> {
    const query: any = {};

    // Handle cursor-based pagination
    if (cursor && Types.ObjectId.isValid(cursor)) {
      query._id = { $lt: new Types.ObjectId(cursor) }; // Ensure we're getting tools that have a lower _id than the cursor
    }

    // Search query filtering
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Uncomment if you want to apply status filter
    // if (status && status !== 'all') {
    //   query.status = status;
    // }

    // Fetch the tools, but limit the results to `limit + 1` to check if there's a next page
    const tools = await Tools.find(query)
      .sort({ _id: -1 }) // Sort by most recent
      .limit(limit + 1)   // Fetch one extra tool to check if there's a next page
      .lean();

    // Determine if there is a next page
    const hasNextPage = tools.length > limit;
    const nextCursor = hasNextPage ? tools[limit - 1]._id.toString() : null; // Next cursor is the last tool in the list

    // Return the tools excluding the last one if there's a next page
    return {
      tools: hasNextPage ? tools.slice(0, limit) : tools,
      nextCursor,
    };
  },


  async suspendTool(toolId: string): Promise<void> {
    const result = await Tools.findByIdAndUpdate(toolId, { $set: { status: 'suspended' } });
    if (!result) throw new Error('Tool not found');
  },

  async unsuspendTool(toolId: string): Promise<void> {
    const result = await Tools.findByIdAndUpdate(toolId, { $set: { status: 'draft' } }); // or 'launched'
    if (!result) throw new Error('Tool not found');
  },

  async promoteTool(toolId: string): Promise<void> {
    const result = await Tools.findByIdAndUpdate(toolId, { $set: { status: 'launched' } });
    if (!result) throw new Error('Tool not found');
  },

  async demoteTool(toolId: string): Promise<void> {
    const result = await Tools.findByIdAndUpdate(toolId, { $set: { status: 'draft' } });
    if (!result) throw new Error('Tool not found');
  },

  async deleteTool(toolId: string): Promise<void> {
    const result = await Tools.findByIdAndDelete(toolId);
    if (!result) throw new Error('Tool not found');
  },
  async rescheduleLaunchDate(toolId: string, newDate: Date): Promise<void> {
    const result = await Tools.findByIdAndUpdate(toolId, {
      $set: { launchDate: newDate }
    });
    if (!result) throw new Error('Tool not found');
  }
,
async setStatus(toolId: string, status: ITool['status']): Promise<void> {
  const result = await Tools.findByIdAndUpdate(toolId, {
    $set: { status }
  });
  if (!result) throw new Error('Tool not found');
},


  
};
