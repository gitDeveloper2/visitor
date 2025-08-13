const { MongoClient } = require('mongodb');

async function migrateFounderStories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('basicutils');
    const collection = db.collection('userblogs');

    // Find blogs that are missing the isFounderStory field
    const blogsWithoutField = await collection.find({ isFounderStory: { $exists: false } }).toArray();
    console.log(`Found ${blogsWithoutField.length} blogs without isFounderStory field`);

    if (blogsWithoutField.length === 0) {
      console.log('No blogs need migration');
      return;
    }

    // Update blogs that are internal (these are likely founder stories)
    const internalBlogs = blogsWithoutField.filter(blog => blog.isInternal === true);
    console.log(`Found ${internalBlogs.length} internal blogs that should be founder stories`);

    if (internalBlogs.length > 0) {
      const result = await collection.updateMany(
        { _id: { $in: internalBlogs.map(blog => blog._id) } },
        { $set: { isFounderStory: true } }
      );
      console.log(`Updated ${result.modifiedCount} internal blogs to have isFounderStory: true`);
    }

    // Update blogs that don't have the field to have isFounderStory: false
    const remainingBlogs = blogsWithoutField.filter(blog => blog.isInternal !== true);
    if (remainingBlogs.length > 0) {
      const result = await collection.updateMany(
        { _id: { $in: remainingBlogs.map(blog => blog._id) } },
        { $set: { isFounderStory: false } }
      );
      console.log(`Updated ${result.modifiedCount} blogs to have isFounderStory: false`);
    }

    // Verify the migration
    const totalBlogs = await collection.countDocuments();
    const founderStories = await collection.find({ isFounderStory: true }).toArray();
    const nonFounderStories = await collection.find({ isFounderStory: false }).toArray();
    
    console.log('\nMigration completed!');
    console.log(`Total blogs: ${totalBlogs}`);
    console.log(`Founder stories: ${founderStories.length}`);
    console.log(`Non-founder stories: ${nonFounderStories.length}`);

    // Show some examples
    if (founderStories.length > 0) {
      console.log('\nExample founder stories:');
      founderStories.slice(0, 3).forEach((blog, index) => {
        console.log(`  ${index + 1}. ${blog.title} by ${blog.authorName}`);
      });
    }

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await client.close();
  }
}

migrateFounderStories(); 