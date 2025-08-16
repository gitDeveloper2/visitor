# Database Seeding Scripts

This directory contains scripts for seeding your MongoDB database with initial data.

## Category Seeding

### Basic Seeding Script

The basic seeding script adds new categories to your database without affecting existing ones.

```bash
# Using npm script
npm run seed:categories

# Or directly
node scripts/seed-categories.js
```

### Advanced Seeding Script

The advanced seeding script provides more control over the seeding process with various options.

```bash
# Using npm script
npm run seed:categories:advanced

# Or directly with options
node scripts/seed-categories-advanced.js [options]
```

#### Available Options

- `--clear`: Clear all existing categories before seeding
- `--update`: Update existing categories and add new ones
- `--dry-run`: Show what would be done without making changes
- `--help` or `-h`: Show help message

#### Examples

```bash
# Add new categories only (default)
node scripts/seed-categories-advanced.js

# Clear all existing categories and add new ones
node scripts/seed-categories-advanced.js --clear

# Update existing categories and add new ones
node scripts/seed-categories-advanced.js --update

# Preview what changes would be made
node scripts/seed-categories-advanced.js --dry-run

# Preview clearing and seeding
node scripts/seed-categories-advanced.js --clear --dry-run

# Show help
node scripts/seed-categories-advanced.js --help
```

## Categories Included

The seeding scripts include the following categories:

### App Categories
- **Web Development** - Tools and applications for web development
- **Productivity** - Tools to boost your productivity and efficiency
- **Design** - Design tools and creative applications
- **Marketing** - Marketing and growth tools
- **Mobile Development** - Mobile app development tools and resources

### Blog Categories
- **Development** - Development tutorials and guides
- **Business** - Business insights and strategies

### Both Categories
- **Technology** - Latest technology news and tools
- **AI & Machine Learning** - Artificial Intelligence and Machine Learning tools and articles
- **Data Science** - Data science tools and educational content

## Category Structure

Each category includes:

```typescript
{
  name: string;           // Display name
  slug: string;          // URL-friendly identifier
  type: 'app' | 'blog' | 'both';  // Category type
  description: string;   // Category description
  icon: string;          // Emoji icon
  color: string;         // Hex color code
  isActive: boolean;     // Whether category is active
  sortOrder: number;     // Display order
  stats: {              // Statistics
    appCount: number;
    blogCount: number;
    totalViews: number;
  };
  metadata: {           // SEO metadata
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
  };
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

## Database Connection

The scripts use the same MongoDB connection configuration as your application:

- **URI**: `NEXT_PUBLIC_MONGO_URI_DEV` or `NEXT_PUBLIC_MONGO_URI`
- **Database**: `NEXT_PUBLIC_MONGO_DATABASE` (defaults to "basicutils")

## Indexes

The advanced seeding script automatically creates the following database indexes for better performance:

- `slug` (unique)
- `type` + `isActive`
- `sortOrder`
- `parentCategory`

## Environment Variables

Make sure you have the following environment variables set:

```bash
# Development
NEXT_PUBLIC_MONGO_URI_DEV=mongodb://your-dev-connection-string

# Production
NEXT_PUBLIC_MONGO_URI=mongodb://your-prod-connection-string

# Database name (optional, defaults to "basicutils")
NEXT_PUBLIC_MONGO_DATABASE=your-database-name
```

## Troubleshooting

### Connection Issues
- Verify your MongoDB connection string is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that your database user has write permissions

### Duplicate Key Errors
- Use `--clear` to remove existing categories first
- Use `--update` to update existing categories instead of creating duplicates

### Permission Errors
- Ensure your MongoDB user has the necessary permissions
- Check that the database exists and is accessible

## Customization

To add your own categories, edit the `categories` array in either seeding script:

```javascript
const categories = [
  {
    name: "Your Category",
    slug: "your-category",
    type: "app", // or "blog" or "both"
    description: "Your category description",
    icon: "🎯",
    color: "#your-color",
    isActive: true,
    sortOrder: 11,
    stats: {
      appCount: 0,
      blogCount: 0,
      totalViews: 0
    },
    metadata: {
      seoTitle: "Your SEO Title",
      seoDescription: "Your SEO description",
      keywords: ["your", "keywords"]
    }
  }
  // ... more categories
];
``` 