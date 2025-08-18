# Environment Setup Guide - AdSense Placeholder System

## 🎯 **Short Answer: Nothing Required!**

**You don't need to set up any environment variables or configuration files.** The system works automatically!

## 🔍 **How Environment Detection Works**

### **Automatic Detection**
The system uses `NODE_ENV` which Next.js sets automatically:

```tsx
// In src/lib/config/environment.ts
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};
```

### **Next.js Automatically Sets NODE_ENV**
- **Development**: `npm run dev` → `NODE_ENV=development`
- **Production**: `npm run build && npm start` → `NODE_ENV=production`

## 🚀 **What You Need to Do**

### **✅ Nothing! Zero Configuration Required**

1. **No .env files needed**
2. **No environment variables to set**
3. **No configuration required**
4. **Just run your normal commands**

## 🧪 **Test Your Environment**

### **Step 1: Start Development Server**
```bash
npm run dev
```

### **Step 2: Visit Test Page**
Go to `/test-env` to see your current environment status.

You should see:
- 🟢 **Development Mode** if running `npm run dev`
- 🔴 **Production Mode** if running `npm run build && npm start`

### **Step 3: Test Ad Placeholders**
- Visit `/demo-ads` to see placeholders in action
- Visit `/dashboard` to see placeholders in real layout

## 📋 **Environment Commands**

| Command | NODE_ENV | What You'll See |
|---------|----------|-----------------|
| `npm run dev` | `development` | 📢 Ad Placeholders |
| `npm run build && npm start` | `production` | 🎯 Real AdSense Ads |

## 🔧 **If You Want to Override (Optional)**

### **Custom Environment Variable**
If you want to force a specific environment, you can set:

```bash
# Windows
set NODE_ENV=development
npm run dev

# Mac/Linux
NODE_ENV=development npm run dev
```

### **But This is NOT Required**
The system works perfectly with the default Next.js behavior.

## 🎯 **Summary**

**You don't need to do anything!**

1. ✅ **No .env files required**
2. ✅ **No environment variables to set**
3. ✅ **No configuration needed**
4. ✅ **Just run `npm run dev` for development**
5. ✅ **Just run `npm run build && npm start` for production**

**The system automatically detects your environment and shows placeholders in development and real ads in production!** 🚀 