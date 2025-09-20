import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export interface Launch {
  _id: ObjectId;
  date: string;
  status: 'pending' | 'active' | 'flushing' | 'flushed';
  apps: ObjectId[];
  createdAt: Date;
  flushedAt?: Date;
}

export interface LaunchWithApps extends Launch {
  appsData: Array<{
    _id: ObjectId;
    name: string;
    description: string;
    totalVotes: number;
    category: string;
    url: string;
    imageUrl?: string;
  }>;
}

/**
 * Get the currently active launch (read-only)
 * Main app only reads from launches collection
 */
export async function getActiveLaunch(): Promise<Launch | null> {
  console.log("trying to fetch active launches")
  try {
    const { db } = await connectToDatabase();
    
    const launch = await db.collection('launches').findOne({
      status: 'active'
    }) as Launch | null;
    console.log("fetched active launch", launch)
    return launch;
  } catch (error) {
    console.error('[MainApp] Error fetching active launch:', error);
    return null;
  }
}

/**
 * Get past launches (read-only)
 * Main app only reads from launches collection
 */
export async function getPastLaunches(limit: number = 10): Promise<Launch[]> {
  try {
    const { db } = await connectToDatabase();
    
    const launches = await db.collection('launches')
      .find({
        status: 'flushed'
      })
      .sort({ date: -1 })
      .limit(limit)
      .toArray() as Launch[];
    
    return launches;
  } catch (error) {
    console.error('[MainApp] Error fetching past launches:', error);
    return [];
  }
}

/**
 * Get launch with populated app data (read-only)
 * Main app only reads from launches collection
 */
export async function getLaunchWithApps(date: string): Promise<LaunchWithApps | null> {
  try {
    const { db } = await connectToDatabase();
    
    const launch = await db.collection('launches').findOne({
      date: date
    }) as Launch | null;
    
    if (!launch) {
      return null;
    }
    
    // Populate apps data
    const appsData = await db.collection('userapps')
      .find({
        _id: { $in: launch.apps }
      })
      .toArray();
    
    return {
      ...launch,
      appsData: appsData.map(app => ({
        _id: app._id,
        name: app.name,
        description: app.description,
        totalVotes: app.totalVotes || 0,
        category: app.category,
        url: app.url,
        imageUrl: app.imageUrl
      }))
    };
  } catch (error) {
    console.error('[MainApp] Error fetching launch with apps:', error);
    return null;
  }
}
