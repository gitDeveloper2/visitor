# Ad Placement Guide for BasicUtils

## **Available Ad Slots**

### **Blog Content Ads (Original)**
- **Slot 1**: `8145805054` - 1stH2 (First H2 heading in blog posts)
- **Slot 2**: `8596397043` - 3rdH2 (Third H2 heading in blog posts)  
- **Slot 3**: `5743244244` - 3rdh2 (Another H2 position)

### **Dashboard Ads**
- **Slot 10**: `1234567890` - DashboardHeader (Top of dashboard)
- **Slot 11**: `2345678901` - DashboardSidebar (Dashboard sidebar)

### **Blog List Ads**
- **Slot 20**: `3456789012` - BlogListHeader (Above blog list)
- **Slot 21**: `4567890123` - BlogListFooter (Below blog list)

### **Launch/Apps Ads**
- **Slot 30**: `5678901234` - LaunchHeader (Above apps list)
- **Slot 31**: `6789012345` - LaunchSidebar (Apps sidebar)

### **Home Page Ads**
- **Slot 40**: `7890123456` - HomePageHero (Hero section)

## **How to Use**

### **1. In HTML Content (Blog Posts)**
```html
<!-- Use existing markers -->
{{AD_1}}  <!-- Will show ad slot 1 -->
{{AD_2}}  <!-- Will show ad slot 2 -->
{{AD_3}}  <!-- Will show ad slot 3 -->
```

### **2. In React Components**
```tsx
import { adRegistry } from "@/app/components/adds/google/AdRegistry";

// In your component
{adRegistry[10]}  // Dashboard header ad
{adRegistry[20]}  // Blog list header ad
{adRegistry[30]}  // Launch header ad
```

### **3. In Layout Files**
```tsx
// Add to dashboard layout
<div className="dashboard-header">
  {adRegistry[10]}
</div>

<div className="dashboard-sidebar">
  {adRegistry[11]}
</div>
```

## **Strategic Placement Recommendations**

### **Dashboard Pages**
- **Header (Slot 10)**: Above main content, below navigation
- **Sidebar (Slot 11)**: Right sidebar, below user info

### **Blog Pages**
- **List Header (Slot 20)**: Above blog list, below page title
- **List Footer (Slot 21)**: Below blog list, above pagination
- **Content (Slots 1-3)**: Within blog posts at H2 headings

### **Launch/Apps Pages**
- **Header (Slot 30)**: Above apps grid, below page title
- **Sidebar (Slot 31)**: Right sidebar, below filters

### **Home Page**
- **Hero (Slot 40)**: Below hero section, above main content

## **Important Notes**

1. **All ads respect GDPR consent** - Only load after marketing consent
2. **Responsive design** - Ads automatically adjust to screen size
3. **Performance optimized** - Scripts load only when needed
4. **Easy to manage** - All ad slots in one registry file

## **Next Steps**

1. **Get real ad slot IDs** from Google AdSense for the new slots
2. **Replace placeholder slots** (1234567890, etc.) with real IDs
3. **Place ads strategically** in your layouts and components
4. **Test ad loading** on different pages and screen sizes 