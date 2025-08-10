/**
 * Migration script to add slug fields to existing blogs and apps
 * Run this script after updating the models to ensure all existing records have slugs
 */

const { MongoClient } = require('mongodb');

// MongoDB connection string - update this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/basicutils';

async function generateSlug(title, existingSlugs) {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')}-${counter}`;
    counter++;
  }
  
  return slug;
}

async function migrateBlogs(db) {
  console.log('Starting blog migration...');
  
  const blogsCollection = db.collection('userblogs');
  
  // Get all blogs that don't have a slug
  const blogsWithoutSlug = await blogsCollection.find({ slug: { $exists: false } }).toArray();
  
  if (blogsWithoutSlug.length === 0) {
    console.log('All blogs already have slugs');
    return;
  }
  
  console.log(`Found ${blogsWithoutSlug.length} blogs without slugs`);
  
  // Get all existing slugs to avoid duplicates
  const existingSlugs = await blogsCollection.find({ slug: { $exists: true } }, { projection: { slug: 1 } }).toArray();
  const existingSlugStrings = existingSlugs.map(blog => blog.slug);
  
  let updatedCount = 0;
  
  for (const blog of blogsWithoutSlug) {
    try {
      const slug = await generateSlug(blog.title, existingSlugStrings);
      
      await blogsCollection.updateOne(
        { _id: blog._id },
        { $set: { slug } }
      );
      
      existingSlugStrings.push(slug);
      updatedCount++;
      
      console.log(`Updated blog "${blog.title}" with slug: ${slug}`);
    } catch (error) {
      console.error(`Failed to update blog "${blog.title}":`, error.message);
    }
  }
  
  console.log(`Successfully updated ${updatedCount} blogs with slugs`);
}

async function migrateApps(db) {
  console.log('Starting app migration...');
  
  const appsCollection = db.collection('apps');
  
  // Get all apps that don't have a slug
  const appsWithoutSlug = await appsCollection.find({ slug: { $exists: false } }).toArray();
  
  if (appsWithoutSlug.length === 0) {
    console.log('All apps already have slugs');
    return;
  }
  
  console.log(`Found ${appsWithoutSlug.length} apps without slugs`);
  
  // Get all existing slugs to avoid duplicates
  const existingSlugs = await appsCollection.find({ slug: { $exists: true } }, { projection: { slug: 1 } }).toArray();
  const existingSlugStrings = existingSlugs.map(app => app.slug);
  
  let updatedCount = 0;
  
  for (const app of appsWithoutSlug) {
    try {
      const slug = await generateSlug(app.name, existingSlugStrings);
      
      await appsCollection.updateOne(
        { _id: app._id },
        { $set: { slug } }
      );
      
      existingSlugStrings.push(slug);
      updatedCount++;
      
      console.log(`Updated app "${app.name}" with slug: ${slug}`);
    } catch (error) {
      console.error(`Failed to update app "${app.name}":`, error.message);
    }
  }
  
  console.log(`Successfully updated ${updatedCount} apps with slugs`);
}

async function main() {
  let client;
  
  try {
    console.log('Connecting to MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    console.log('Connected to MongoDB');
    
    // Run migrations
    await migrateBlogs(db);
    await migrateApps(db);
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { migrateBlogs, migrateApps }; 