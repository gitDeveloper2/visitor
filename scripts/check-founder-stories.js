const { MongoClient } = require('mongodb');

async function checkFounderStories() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('basicutils');
    const collection = db.collection('userblogs');

    // Check total blogs
    const totalBlogs = await collection.countDocuments();
    console.log(`Total blogs: ${totalBlogs}`);

    // Check blogs with isFounderStory field
    const founderStories = await collection.find({ isFounderStory: true }).toArray();
    console.log(`Blogs with isFounderStory: true: ${founderStories.length}`);

    // Check blogs without isFounderStory field
    const blogsWithoutField = await collection.find({ isFounderStory: { $exists: false } }).toArray();
    console.log(`Blogs without isFounderStory field: ${blogsWithoutField.length}`);

    // Check approved blogs
    const approvedBlogs = await collection.find({ status: 'approved' }).toArray();
    console.log(`Approved blogs: ${approvedBlogs.length}`);

    // Show sample of blogs
    const sampleBlogs = await collection.find({}).limit(3).toArray();
    console.log('\nSample blogs:');
    sampleBlogs.forEach((blog, index) => {
      console.log(`\nBlog ${index + 1}:`);
      console.log(`  Title: ${blog.title}`);
      console.log(`  Status: ${blog.status}`);
      console.log(`  isFounderStory: ${blog.isFounderStory}`);
      console.log(`  isInternal: ${blog.isInternal}`);
      console.log(`  Author: ${blog.authorName}`);
    });

    // Check if there are any blogs that should be founder stories based on isInternal
    const internalBlogs = await collection.find({ isInternal: true }).toArray();
    console.log(`\nBlogs with isInternal: true: ${internalBlogs.length}`);

    if (internalBlogs.length > 0) {
      console.log('\nInternal blogs that might need isFounderStory field:');
      internalBlogs.forEach((blog, index) => {
        console.log(`  ${index + 1}. ${blog.title} - isFounderStory: ${blog.isFounderStory}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkFounderStories(); 