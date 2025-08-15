# Environment Variables Setup for Better Auth

## Required Environment Variables

To fix the social provider warnings and enable full authentication functionality, you need to set up the following environment variables:

### 1. Create a `.env.local` file in your project root:

```bash
# Better Auth Configuration

# GitHub OAuth (Optional - for social login)
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Google OAuth (Optional - for social login)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Better Auth URL (Optional - only needed if using a different domain)
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Connection (if not already set)
MONGODB_URI=your_mongodb_connection_string_here
```

### 2. How to Get OAuth Credentials:

#### GitHub OAuth:
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Click "New OAuth App"
3. Set Authorization callback URL to: `http://localhost:3000/api/auth/github/callback`
4. Copy the Client ID and Client Secret

#### Google OAuth:
1. Go to Google Cloud Console > APIs & Services > Credentials
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Set Authorized redirect URIs to: `http://localhost:3000/api/auth/google/callback`
4. Copy the Client ID and Client Secret

### 3. Current Warnings Explained:

The warnings you're seeing:
```
WARN [Better Auth]: Social provider github is missing clientId or clientSecret
WARN [Better Auth]: Social provider google is missing clientId or clientSecret
```

These are just warnings and won't break your application. They mean:
- ✅ **Email/password authentication will work**
- ⚠️ **Social login (GitHub/Google) won't work until credentials are set**
- ✅ **All other functionality remains intact**

### 4. Testing Authentication:

After setting up the environment variables:

1. **Email/Password Auth**: Should work immediately
2. **Social Login**: Will work after adding OAuth credentials
3. **Protected Routes**: Should work with proper authentication
4. **Admin Access**: Should work for users with admin role

### 5. Quick Test:

1. Start your development server
2. Navigate to `/auth/signin`
3. Try creating an account with email/password
4. Check if you can access protected routes

### 6. Troubleshooting:

If you still see issues:
- Check that `.env.local` is in your project root
- Restart your development server after adding environment variables
- Verify MongoDB connection is working
- Check browser console for any client-side errors

## Note:
The social login warnings are **not critical** - your application will work fine with just email/password authentication. Social login is an optional enhancement. 