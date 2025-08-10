# Slug Migration Guide

This document explains the migration from MongoDB ObjectId-based routing to human-readable slug-based routing for blogs and apps.

## What Changed

### Before (ObjectId-based)
- Blog URLs: `/blogs/507f1f77bcf86cd799439011`
- App URLs: `/launch/507f1f77bcf86cd799439011`

### After (Slug-based)
- Blog URLs: `/blogs/building-scalable-react-applications`
- App URLs: `/launch/my-awesome-app`

## Benefits

1. **SEO Friendly**: Search engines prefer human-readable URLs
2. **User Experience**: Users can understand and share URLs more easily
3. **Professional Appearance**: URLs look more professional and trustworthy
4. **Better Analytics**: Easier to track which content is performing well

## Database Schema Changes

### UserBlog Model
- Added `slug` field (required, unique, indexed)
- Added compound index on `{ slug: 1, status: 1 }`

### App Model
- Added `slug` field (required, unique, indexed)
- Added compound index on `{ slug: 1, status: 1 }`
- Expanded with additional fields for comprehensive app information

## API Changes

### Blog Routes
- **Old**: `/api/user-blogs/[id]` (ObjectId-based)
- **New**: `/api/user-blogs/[slug]` (Slug-based)

### App Routes
- **Old**: `/api/apps/[id]` (ObjectId-based)
- **New**: `/api/apps/[slug]` (Slug-based)

## Migration Process

### 1. Run the Migration Script

```bash
npm run migrate:slugs
```

This script will:
- Find all existing blogs and apps without slugs
- Generate unique slugs based on titles/names
- Update the database with the new slug fields
- Ensure no duplicate slugs are created

### 2. Update Your Code

If you have any hardcoded links to blogs or apps, update them from:
```tsx
// Old
href={`/blogs/${blog._id}`}
href={`/launch/${app._id}`}

// New
href={`/blogs/${blog.slug}`}
href={`/launch/${app.slug}`}
```

### 3. Update API Calls

If you're calling the API directly, update from:
```tsx
// Old
fetch(`/api/user-blogs/${blogId}`)
fetch(`/api/apps/${appId}`)

// New
fetch(`/api/user-blogs/${blogSlug}`)
fetch(`/api/apps/${appSlug}`)
```

## Slug Generation

Slugs are automatically generated using the following rules:

1. Convert title to lowercase
2. Remove special characters (keep only letters, numbers, spaces, hyphens)
3. Replace spaces with hyphens
4. Remove multiple consecutive hyphens
5. Remove leading/trailing hyphens
6. If duplicate exists, append a number (e.g., `my-title-1`)

### Examples
- "Building Scalable React Applications" → `building-scalable-react-applications`
- "My Awesome App!" → `my-awesome-app`
- "React & TypeScript Guide" → `react-typescript-guide`

## Automatic Slug Updates

When editing blogs or apps:
- If the title/name changes, a new slug is automatically generated
- The old slug becomes invalid (returns 404)
- Users with old bookmarks will need to find the new URL

## Error Handling

- **404 Not Found**: Returned when a slug doesn't exist
- **400 Bad Request**: Returned when slug parameter is missing
- **500 Internal Server Error**: Database connection issues

## Performance Considerations

- Slugs are indexed for fast lookups
- Compound indexes optimize queries by slug and status
- Slug generation is done at write time, not read time

## Rollback Plan

If you need to rollback:

1. **Database**: Remove the `slug` field from collections
2. **Code**: Revert to using `_id` for routing
3. **API**: Restore the old `[id]` routes

## Testing

After migration, test:

1. **Blog Creation**: Ensure new blogs get slugs
2. **Blog Editing**: Ensure title changes update slugs
3. **URL Access**: Ensure old ObjectId URLs return 404
4. **New URLs**: Ensure slug-based URLs work correctly
5. **Duplicate Handling**: Ensure no duplicate slugs are created

## Monitoring

Watch for:
- 404 errors on old ObjectId URLs
- Duplicate slug errors in logs
- Performance of slug-based queries

## Future Considerations

- Consider implementing redirects from old URLs to new ones
- Monitor slug length and uniqueness
- Consider implementing custom slug editing for users
- Plan for potential slug collisions in high-traffic scenarios

## Support

If you encounter issues during migration:
1. Check the migration script logs
2. Verify database indexes are created
3. Ensure all code references are updated
4. Test with a small subset of data first 