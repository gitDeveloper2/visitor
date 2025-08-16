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

// Debug: Show which environment variables are available
console.log('🔍 Environment variables check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_MONGO_URI_DEV:', process.env.NEXT_PUBLIC_MONGO_URI_DEV ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_MONGO_URI:', process.env.NEXT_PUBLIC_MONGO_URI ? '✅ Set' : '❌ Not set');
console.log('NEXT_PUBLIC_MONGO_DATABASE:', process.env.NEXT_PUBLIC_MONGO_DATABASE || 'basicutils (default)');
console.log('Selected URI:', uri.includes('localhost') ? 'localhost (fallback)' : 'Remote MongoDB');

// Validate required environment variables
if (!uri || uri.includes('localhost')) {
  console.error('❌ Error: MongoDB connection string not found in environment variables');
  console.error('Please set MONGODB_URI, NEXT_PUBLIC_MONGO_URI_DEV, or NEXT_PUBLIC_MONGO_URI');
  console.error('Current working directory:', process.cwd());
  console.error('Looking for .env files in:', process.cwd());
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

async function seedCategories() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(databaseName);
    const categoriesCollection = db.collection('categories');
    
    console.log('Connected to database:', databaseName);
    
    // Check if categories already exist
    const existingCount = await categoriesCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing categories. Do you want to clear them first? (y/n)`);
      // For now, we'll just add new ones without clearing
      console.log('Adding new categories without clearing existing ones...');
    }
    
    // Add timestamps to all categories
    const categoriesWithTimestamps = categories.map(category => ({
      ...category,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert categories
    const result = await categoriesCollection.insertMany(categoriesWithTimestamps);
    
    console.log(`✅ Successfully seeded ${result.insertedCount} categories:`);
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name} (${category.slug}) - ${category.type}`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

// Run the seeding function
seedCategories(); 