const { MongoClient } = require('mongodb');
const path = require('path');

// Load environment variables from .env.local file
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

// MongoDB connection string - use the same variables as other scripts
const uri = process.env.MONGODB_URI || 
           process.env.NEXT_PUBLIC_MONGO_URI_DEV || 
           process.env.NEXT_PUBLIC_MONGO_URI ||
           'mongodb://localhost:27017/basicutils';

const databaseName = process.env.NEXT_PUBLIC_MONGO_DATABASE || "basicutils";

// Validate required environment variables
if (!uri) {
  console.error('❌ Error: MongoDB connection string not found in environment variables');
  console.error('Please set MONGODB_URI, NEXT_PUBLIC_MONGO_URI_DEV, or NEXT_PUBLIC_MONGO_URI');
  process.exit(1);
}

// Sample categories data
const categories = [
  {
    name: "Web Development",
    slug: "web-development",
    type: "app",
    description: "Tools and applications for web development",
    icon: "🌐",
    color: "#1976d2",
    isActive: true,
    sortOrder: 1,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Web Development Tools",
      seoDescription: "Discover the best web development tools and applications",
      keywords: ["web development", "tools", "applications", "coding"]
    }
  },
  {
    name: "Productivity",
    slug: "productivity",
    type: "app",
    description: "Tools to boost your productivity and efficiency",
    icon: "⚡",
    color: "#2e7d32",
    isActive: true,
    sortOrder: 2,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Productivity Tools",
      seoDescription: "Enhance your productivity with these powerful tools",
      keywords: ["productivity", "efficiency", "tools", "workflow"]
    }
  },
  {
    name: "Design",
    slug: "design",
    type: "app",
    description: "Design tools and creative applications",
    icon: "🎨",
    color: "#c2185b",
    isActive: true,
    sortOrder: 3,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Design Tools",
      seoDescription: "Create amazing designs with these professional tools",
      keywords: ["design", "creative", "graphics", "art"]
    }
  },
  {
    name: "Marketing",
    slug: "marketing",
    type: "app",
    description: "Marketing and growth tools",
    icon: "📈",
    color: "#f57c00",
    isActive: true,
    sortOrder: 4,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Marketing Tools",
      seoDescription: "Grow your business with these marketing tools",
      keywords: ["marketing", "growth", "business", "analytics"]
    }
  },
  {
    name: "Development",
    slug: "development",
    type: "blog",
    description: "Development tutorials and guides",
    icon: "💻",
    color: "#1565c0",
    isActive: true,
    sortOrder: 5,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Development Blog",
      seoDescription: "Learn development with our comprehensive guides",
      keywords: ["development", "programming", "tutorials", "guides"]
    }
  },
  {
    name: "Business",
    slug: "business",
    type: "blog",
    description: "Business insights and strategies",
    icon: "💼",
    color: "#388e3c",
    isActive: true,
    sortOrder: 6,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Business Blog",
      seoDescription: "Get insights into business strategies and growth",
      keywords: ["business", "strategy", "growth", "insights"]
    }
  },
  {
    name: "Technology",
    slug: "technology",
    type: "both",
    description: "Latest technology news and tools",
    icon: "🚀",
    color: "#7b1fa2",
    isActive: true,
    sortOrder: 7,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Technology",
      seoDescription: "Stay updated with the latest technology trends and tools",
      keywords: ["technology", "trends", "news", "innovation"]
    }
  },
  {
    name: "AI & Machine Learning",
    slug: "ai-machine-learning",
    type: "both",
    description: "Artificial Intelligence and Machine Learning tools and articles",
    icon: "🤖",
    color: "#d32f2f",
    isActive: true,
    sortOrder: 8,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "AI & Machine Learning",
      seoDescription: "Explore AI and ML tools, tutorials, and insights",
      keywords: ["ai", "machine learning", "artificial intelligence", "ml"]
    }
  },
  {
    name: "Mobile Development",
    slug: "mobile-development",
    type: "app",
    description: "Mobile app development tools and resources",
    icon: "📱",
    color: "#ff6f00",
    isActive: true,
    sortOrder: 9,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Mobile Development Tools",
      seoDescription: "Build amazing mobile apps with these development tools",
      keywords: ["mobile", "app development", "ios", "android"]
    }
  },
  {
    name: "Data Science",
    slug: "data-science",
    type: "both",
    description: "Data science tools and educational content",
    icon: "📊",
    color: "#1976d2",
    isActive: true,
    sortOrder: 10,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Data Science",
      seoDescription: "Master data science with tools and educational content",
      keywords: ["data science", "analytics", "statistics", "visualization"]
    }
  }
];

async function seedCategories(options = {}) {
  const { 
    clear = false, 
    update = false, 
    dryRun = false 
  } = options;
  
  const client = new MongoClient(uri);
  
  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(databaseName);
    const categoriesCollection = db.collection('categories');
    
    console.log('✅ Connected to database:', databaseName);
    
    // Check existing categories
    const existingCategories = await categoriesCollection.find({}).toArray();
    const existingCount = existingCategories.length;
    
    console.log(`📊 Found ${existingCount} existing categories`);
    
    if (existingCount > 0) {
      console.log('\n📋 Existing categories:');
      existingCategories.forEach(cat => {
        console.log(`  - ${cat.name} (${cat.slug}) - ${cat.type}`);
      });
    }
    
    if (dryRun) {
      console.log('\n🔍 DRY RUN MODE - No changes will be made');
      console.log('\n📝 Categories to be processed:');
      categories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category.name} (${category.slug}) - ${category.type}`);
      });
      return;
    }
    
    let result;
    
    if (clear) {
      console.log('\n🗑️  Clearing existing categories...');
      await categoriesCollection.deleteMany({});
      console.log('✅ Cleared existing categories');
    }
    
    if (update && existingCount > 0) {
      console.log('\n🔄 Updating existing categories...');
      let updatedCount = 0;
      
      for (const category of categories) {
        const existingCategory = existingCategories.find(cat => cat.slug === category.slug);
        
        if (existingCategory) {
          // Update existing category
          const updateData = {
            ...category,
            updatedAt: new Date(),
            // Preserve existing stats if they exist
            stats: existingCategory.stats || category.stats
          };
          
          await categoriesCollection.updateOne(
            { slug: category.slug },
            { $set: updateData }
          );
          updatedCount++;
          console.log(`  ✅ Updated: ${category.name}`);
        } else {
          // Insert new category
          const newCategory = {
            ...category,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await categoriesCollection.insertOne(newCategory);
          console.log(`  ➕ Added: ${category.name}`);
        }
      }
      
      console.log(`\n✅ Updated ${updatedCount} categories and added ${categories.length - updatedCount} new ones`);
      
    } else {
      console.log('\n➕ Adding new categories...');
      
      // Add timestamps to all categories
      const categoriesWithTimestamps = categories.map(category => ({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      // Insert categories
      result = await categoriesCollection.insertMany(categoriesWithTimestamps);
      
      console.log(`✅ Successfully seeded ${result.insertedCount} categories:`);
      categories.forEach((category, index) => {
        console.log(`  ${index + 1}. ${category.name} (${category.slug}) - ${category.type}`);
      });
    }
    
    // Create indexes for better performance
    console.log('\n🔧 Creating database indexes...');
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true });
    await categoriesCollection.createIndex({ type: 1, isActive: 1 });
    await categoriesCollection.createIndex({ sortOrder: 1 });
    await categoriesCollection.createIndex({ parentCategory: 1 });
    console.log('✅ Database indexes created');
    
    // Final count
    const finalCount = await categoriesCollection.countDocuments();
    console.log(`\n📊 Total categories in database: ${finalCount}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed.');
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    clear: args.includes('--clear'),
    update: args.includes('--update'),
    dryRun: args.includes('--dry-run')
  };
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🌱 Category Database Seeding Script

Usage: node scripts/seed-categories-advanced.js [options]

Options:
  --clear     Clear all existing categories before seeding
  --update    Update existing categories and add new ones
  --dry-run   Show what would be done without making changes
  --help, -h  Show this help message

Examples:
  node scripts/seed-categories-advanced.js                    # Add new categories only
  node scripts/seed-categories-advanced.js --clear            # Clear and add all categories
  node scripts/seed-categories-advanced.js --update           # Update existing and add new
  node scripts/seed-categories-advanced.js --dry-run          # Preview changes
  node scripts/seed-categories-advanced.js --clear --dry-run  # Preview clearing and seeding
`);
    process.exit(0);
  }
  
  return options;
}

// Run the seeding function with parsed options
const options = parseArgs();
seedCategories(options); 